import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import socketio from "socket.io-client";
import VideoItem from "./components/VideoItem";
import "./CallScreen.css";

const host = "http://192.168.1.6:5000/";
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

function CallScreen() {
  const params = useParams();
  const localUsername = params.username;
  const roomName = params.room;
  const localVideoRef = useRef(null);
  const deskVideoRef = useRef(null);
  const socket = useRef(null);
  const pc = useRef({}); // For RTCPeerConnection Objects
  const [videos, setVideos] = useState([]);
  const [deskStreams, setDeskStreams] = useState([]);
  const [newStream, setNewStream] = useState(null);
  const [deleteStream, setDeleteStream] = useState(null);
  const [micState, setMicState] = useState(true);
  const [camState, setCamState] = useState(true);
  const [deskState, setDeskState] = useState(false);

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
    setVideos([]);
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
    setNewStream({id: sid, stream: event.stream});
  };}

  const onRemoveStream = (sid) => {
    return (event) => {
    console.log("Delete remote stream");
    setDeleteStream(sid);
  };}

  const createPeerConnection = (sid) => {
    try {
      pc.current[sid] = new RTCPeerConnection(STUN_SERVERS);
      pc.current[sid].onicecandidate = onIceCandidate(sid);
      pc.current[sid].onaddstream = onAddStream(sid);
      pc.current[sid].onremovestream = onRemoveStream(sid);
      const localStream = localVideoRef.current.srcObject;
      pc.current[sid].addStream(localStream);
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
    
    socket.current.on("ready", (username) => {
      console.log("Ready to Connect!");
      createPeerConnection(username);
      sendOffer(username);
    });
  
    socket.current.on("data", (data, username) => {
      signalingDataHandler(data, username);
    });
  
    startConnection();
    return function cleanup() {
      endConnection();
      window.removeEventListener('beforeunload', handleTabClosing);
    };
  }, []);

  useEffect(() => {
    socket.current.on("leave", (username) => {
      console.log("Disconnect!");
      pc.current[username].close();
      let newVideos = videos.filter(function(item) { return item.id !== username });
      setVideos(newVideos);
    });
  }, [videos]);

  useEffect(() => {
    if(newStream !== null) {
      const exist = videos.find(item => item.id === newStream.id);
      if(exist === undefined){
        setVideos(videos => [...videos, newStream])
      } else {
        setDeskStreams(deskStreams => [...deskStreams, newStream])
      }
    }
  }, [newStream]);

  useEffect(() => {
    if(deleteStream !== null) {
      let newVideos = deskStreams.filter(function(item) { return item.id !== deleteStream });
      setDeskStreams(newVideos);
    }
  }, [deleteStream]);

  useEffect(() => {
    if(deskState) {
      streamDesk(deskVideoRef.current);
    } 
  }, [deskState]);

  useEffect(() => {
    muteAudio(pc.current, !micState);
  }, [micState]);

  useEffect(() => {
    muteVideo(pc.current, !camState);
  }, [camState]);
  
  const renderVideos = (videos, type) => {
    return videos.map(item => <VideoItem key={item.id} stream={item.stream} type={type}/>);
  };

  const handleAudio = () => {
    if(micState) {
      setMicState(false);
    } else {
      setMicState(true);
    }
  } 

  const handleVideo = () => {
    if(camState) {
      setCamState(false);
    } else {
      setCamState(true);
    }
  } 

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

  const endStream = (stream) => {
    stream.srcObject.getTracks().forEach(function(track) {
      track.stop();
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

  const navigate = useNavigate();
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
        <video className="userVideo" autoPlay muted playsInline ref={localVideoRef} />
        {renderVideos(videos, "userVideo")}
        {renderVideos(deskStreams, "deskVideo")}
        {deskState?<video autoPlay muted playsInline ref={deskVideoRef} />:null}
      </div>
      <button onClick={handleVideo} style={{"color": camState?"green":"red"}}>Video</button>
      <button onClick={handleAudio} style={{"color": micState?"green":"red"}}>Audio</button>
      <button onClick={handleStream} style={{"color": deskState?"green":"red"}}>Stream</button>
      <button onClick={handleEndCall} style={{"color": "red"}}>End</button>
    </div>
  );
}

export default CallScreen;