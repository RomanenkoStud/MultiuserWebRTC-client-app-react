import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, useReducer } from "react";
import socketio from "socket.io-client";
import VideoItem from "./components/VideoItem";
import "./CallScreen.css";

const host = "http://localhost:5000/";
const connectionOptions = {
  autoConnect: false,
};
const STUN_SERVERS = {
  iceServers: [
    {
      urls: "stun:relay.metered.ca:80",
    },
    {
      urls: "turn:relay.metered.ca:80",
      username: "225cb4947d2e0039e9e91749",
      credential: "jfC3ZhKAEL0v9nIa",
    },
    {
      urls: "turn:relay.metered.ca:443",
      username: "225cb4947d2e0039e9e91749",
      credential: "jfC3ZhKAEL0v9nIa",
    },
    {
      urls: "turn:relay.metered.ca:443?transport=tcp",
      username: "225cb4947d2e0039e9e91749",
      credential: "jfC3ZhKAEL0v9nIa",
    },
  ],
};
const userVideoSize = { height: 300, width: 300, };
const deskVideoSize = { height: 720, width: 1280, };

const muteAudio = (connections, audioState) => {
  if (connections.length !== 0) {
    for (const id in connections) {
      let sender = connections[id].getSenders().find((s) => s.track.kind === "audio");
      sender.track.enabled = !audioState;
    }
  }
}

const muteVideo = (connections, videoState) => {
  if (connections.length !== 0) {
    for (const id in connections) {
      let sender = connections[id].getSenders().find((s) => s.track.kind === "video");
      sender.track.enabled = !videoState;
    }
  }
}

const endStream = (stream) => {
  stream.srcObject.getTracks().forEach(function(track) {
    track.stop();
  });
}

const mediaReducer = (state, action) => {
  switch (action.type) {
    case 'audio':
      return {mic: !state.mic, cam: state.cam};
    case 'video':
      return {mic: state.mic, cam: !state.cam};
    default:
      throw new Error();
  }
}

const streamReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      const exist = state.users.find(item => item.id === action.value.id);
      if(exist === undefined) {
        return {users: [...state.users, action.value], desk: state.desk};
      } else {
        return {users: state.users, desk: [...state.desk, action.value]};
      }
    case 'removeDemo':
      let newDemoStreams = state.desk.filter(function(item) { return item.id !== action.value });
      return {users: state.users, desk: newDemoStreams};
    case 'remove':
      let newStreams1 = state.users.filter(function(item) { return item.id !== action.value });
      let newStreams2 = state.desk.filter(function(item) { return item.id !== action.value });
      return {users: newStreams1, desk: newStreams2};
    case 'empty':
      return {users: [], desk: []};
    default:
      throw new Error();
  }
}

function CallScreen() {
  const params = useParams();
  const localUsername = params.username;
  const roomName = params.room;
  const localVideoRef = useRef(null);
  const deskVideoRef = useRef(null);
  const socket = useRef(null);
  const pc = useRef({}); // For RTCPeerConnection Objects
  const [mediaState, mediaDispatch] = useReducer(mediaReducer, {mic: true, cam: true});
  const [streamState, streamDispatch] = useReducer(streamReducer, {users: [], desk: []});
  const [deskState, setDeskState] = useState(false);
  const navigate = useNavigate();

  const sendData = (data) => {
    socket.current.emit("data", {
      username: localUsername,
      room: roomName,
      data: data,
    });
  };

  const startConnection = () => {
    navigator.mediaDevices
      .getUserMedia({
        frameRate: { 
          ideal: 8, 
          max: 10 },
        audio: true,
        video: userVideoSize,
      })
      .then((stream) => {
        console.log("Local Stream found");
        localVideoRef.current.srcObject = stream;
        socket.current.connect();
        socket.current.emit("join", { username: localUsername, room: roomName });
      })
      .catch((error) => {
        console.error("Stream not found: ", error);
      });
  };

  const endConnection = () => {
    socket.current.emit("leave", { username: localUsername, room: roomName });
    socket.current.close();
    for (let sid in pc.current) {
      pc.current[sid].close();
    }
    streamDispatch({type: 'empty'});
  };

  const onIceCandidate = (sid) => {
    return (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate");
      sendData({description: {
        type: "candidate",
        candidate: event.candidate,
      }, id: sid,});
    }}
  };

  const onAddStream = (sid) => {
    return (event) => {
    console.log("Adding remote stream");
    streamDispatch({type: 'add', value: {id: sid, stream: event.stream}});
  };}

  const onRemoveStream = (sid) => {
    return (event) => {
    console.log("Delete remote stream");
    streamDispatch({type: 'removeDemo', value: sid});
  };}

  const createPeerConnection = (sid) => {
    try {
      pc.current[sid] = new RTCPeerConnection(STUN_SERVERS);
      pc.current[sid].onicecandidate = onIceCandidate(sid);
      pc.current[sid].onaddstream = onAddStream(sid);
      pc.current[sid].onremovestream = onRemoveStream(sid);
      const localStream = localVideoRef.current.srcObject;
      pc.current[sid].addStream(localStream);
      if(deskState) {
        const deskStream = deskVideoRef.current.srcObject;
        pc.current[sid].addStream(deskStream);
      }
      console.log("PeerConnection created", sid);
    } catch (error) {
      console.error("PeerConnection failed: ", error);
    }
  };

  const setAndSendLocalDescription = (sid) => {
    return (sessionDescription) => {
    pc.current[sid].setLocalDescription(sessionDescription);
    console.log("Local description set", sid);
    sendData({description:sessionDescription, id: sid,});
  };}

  const sendOffer = (sid) => {
    console.log("Sending offer", sid);
    pc.current[sid].createOffer().then(setAndSendLocalDescription(sid), (error) => {
      console.error("Send offer failed: ", error);
    });
  };

  const sendAnswer = (sid) => {
    console.log("Sending answer");
    pc.current[sid].createAnswer().then(setAndSendLocalDescription(sid), (error) => {
      console.error("Send answer failed: ", error);
    });
  };

  const signalingDataHandler = (data, username) => {
    if(data.id === localUsername) {
      if (data.description.type === "offer") {
        if (pc.current[username] === undefined) {
          createPeerConnection(username);
        }
        pc.current[username].setRemoteDescription(new RTCSessionDescription(data.description));
        sendAnswer(username);
      } else if (data.description.type === "answer") {
        pc.current[username].setRemoteDescription(new RTCSessionDescription(data.description));
      } else if (data.description.type === "candidate") {
        pc.current[username].addIceCandidate(new RTCIceCandidate(data.description.candidate));
      } else {
        console.log("Unknown Data");
      }
    }
  };

  const handleTabClosing = (event) => {
    event.preventDefault();
    endConnection()
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClosing);
    socket.current = socketio(host, connectionOptions);
    socket.current.on("room_full", () => {
      console.log("Room is full!");
      endStream(localVideoRef.current);
      endConnection();
    });
    socket.current.on("leave", (username) => {
      console.log("Disconnect!");
      pc.current[username].close();
      streamDispatch({type: 'remove', value: username});
    });
    startConnection();
    return function cleanup() {
      endConnection();
      window.removeEventListener('beforeunload', handleTabClosing);
    };
  }, []);

  useEffect(() => {
    if(deskState) {
      streamDesk(deskVideoRef.current);
    } 
    socket.current.on("ready", (username) => {
      console.log("Ready to Connect!");
      createPeerConnection(username);
      sendOffer(username);
    });
    socket.current.on("data", (data, username) => {
      signalingDataHandler(data, username);
    });
  }, [deskState]);

  useEffect(() => {
    muteVideo(pc.current, !mediaState.cam);
    muteAudio(pc.current, !mediaState.mic);
  }, [mediaState]);
  
  const renderVideos = (videos) => {
    return videos.map(item => <VideoItem key={item.id} stream={item.stream}/>);
  };

  const streamDesk = (localStream) => {
    navigator.mediaDevices
      .getDisplayMedia({
        frameRate: { 
          ideal: 8, 
          max: 10 },
        audio: true,
        video: deskVideoSize,
      })
      .then((stream) => {
        console.log("Desk Stream found");
        localStream.srcObject = stream;
        for (let sid in pc.current) {
          pc.current[sid].addStream(stream);
          sendOffer(sid);
        }
      })
      .catch((error) => {
        console.error("Stream not found: ", error);
      });
  }

  const handleStream = () => {
    if(deskState) {
      for (let sid in pc.current) {
        pc.current[sid].removeStream(deskVideoRef.current.srcObject);
        sendOffer(sid);
      }
      endStream(deskVideoRef.current);
      setDeskState(false);
    } else {
      setDeskState(true);
    }
  } 

  const handleEndCall = () => {
    endStream(localVideoRef.current);
    endConnection();
    navigate("/");
  }

  return (
    <div>
      <label>{"Username: " + localUsername}</label>
      <label>{"Room Id: " + roomName}</label>
      <div>
        <div className="usersContainer">
          <video autoPlay muted playsInline ref={localVideoRef} />
          {renderVideos(streamState.users)}
        </div>
        <div>
          {deskState?<video className="deskVideo" autoPlay muted playsInline ref={deskVideoRef} />:null}
          {renderVideos(streamState.desk)}
        </div>
      </div>
      <button onClick={() => mediaDispatch({type: 'video'})} 
        style={{"color": mediaState.cam?"green":"red"}}>Video</button>
      <button onClick={() => mediaDispatch({type: 'audio'})} 
        style={{"color": mediaState.mic?"green":"red"}}>Audio</button>
      <button onClick={handleStream} style={{"color": deskState?"green":"red"}}>Stream</button>
      <button onClick={handleEndCall} style={{"color": "red"}}>End</button>
    </div>
  );
}

export default CallScreen;