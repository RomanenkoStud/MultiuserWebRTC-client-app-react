import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import socketio from "socket.io-client";
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

function CallScreen() {
  const params = useParams();
  const localUsername = params.username;
  const roomName = params.room;
  const localVideoRef = useRef(null);
  const socket = socketio(host, connectionOptions);
  const pc = useRef({}); // For RTCPeerConnection Objects

  const sendData = (data) => {
    socket.emit("data", {
      username: localUsername,
      room: roomName,
      data: data,
    });
  };

  const startConnection = () => {
    navigator.mediaDevices
      .getUserMedia({
        frameRate: { ideal: 8, max: 10 },
        audio: false,
        video: {
          height: 150,
          width: 150,
        },
      })
      .then((stream) => {
        console.log("Local Stream found");
        localVideoRef.current.srcObject = stream;
        socket.connect();
        socket.emit("join", { username: localUsername, room: roomName });
      })
      .catch((error) => {
        console.error("Stream not found: ", error);
      });
  };

  const endConnection = () => {
    socket.emit("leave", { username: localUsername, room: roomName });
    socket.close();
    for (let sid in pc.current) {
      pc.current[sid].close();
      const video = document.getElementById(sid);
      video.remove();
    }
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

  const onTrack = (sid) => {
    return (event) => {
    console.log("Adding remote track");
    
    const room = document.getElementById("room");
    var video = document.createElement("video");
    video.id = sid;
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = event.streams[0];
    room.appendChild(video);
  };}

  const createPeerConnection = (sid) => {
    try {
      pc.current[sid] = new RTCPeerConnection(STUN_SERVERS);
      pc.current[sid].onicecandidate = onIceCandidate(sid);
      pc.current[sid].ontrack = onTrack(sid);
      const localStream = localVideoRef.current.srcObject;
      for (const track of localStream.getTracks()) {
        pc.current[sid].addTrack(track, localStream);
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
        createPeerConnection(username);
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

  socket.on("ready", (username) => {
    console.log("Ready to Connect!");
    createPeerConnection(username);
    sendOffer(username);
  });

  socket.on("leave", (username) => {
    console.log("Disconnect!");
    const video = document.getElementById(username);
    video.remove();
    pc[username].close();
  });

  socket.on("data", (data, username) => {
    console.log("Data received: ", data);
    signalingDataHandler(data, username);
  });

  const handleTabClosing = (event) => {
    event.preventDefault();
    endConnection()
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClosing);
    startConnection();
    return function cleanup() {
      endConnection();
      window.removeEventListener('beforeunload', handleTabClosing);
    };
  }, []);

  return (
    <div id="room">
      <label>{"Username: " + localUsername}</label>
      <label>{"Room Id: " + roomName}</label>
      <video autoPlay muted playsInline ref={localVideoRef} />
    </div>
  );
}

export default CallScreen;