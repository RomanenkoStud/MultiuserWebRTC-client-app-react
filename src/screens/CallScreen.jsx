import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, useReducer } from "react";
import socketio from "socket.io-client";
import VideoItem from "../components/VideoItem";
import { Button, ButtonGroup } from '@mui/material';
import { CssBaseline, Box, Container, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import UserVideo from '../components/UserVideo';

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

const muteAudio = (dataChannel, localStream, audioState) => {
  const audioTrack = localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioState;
  const event = new CustomEvent('mutedchange', { detail: { muted: audioState } });
    audioTrack.dispatchEvent(event);

    // Send a message to the remote peer over the data channel
    const message = {
      type: 'mute-track',
      trackType: 'audio',
      muted: audioState
    };
    for (const id in dataChannel) {
      dataChannel[id].send(JSON.stringify(message));
    }
}

const muteVideo = (dataChannel, localStream, videoState) => {
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoState;
  const event = new CustomEvent('mutedchange', { detail: { muted: videoState } });
  videoTrack.dispatchEvent(event);

  // Send a message to the remote peer over the data channel
  const message = {
    type: 'mute-track',
    trackType: 'video',
    muted: videoState
  };
  for (const id in dataChannel) {
    dataChannel[id].send(JSON.stringify(message));
  }
}

const streamLocal = (localStreamDispatch) => {
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
      localStreamDispatch({type: 'stream', value: {stream: stream}});
    })
    .catch((error) => {
      console.error("Stream not found: ", error);
    });
};

const streamDesk = (localStreamDispatch, addStreamToPeers) => {
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
      localStreamDispatch({type: 'desk', value: {desk: stream} })
      addStreamToPeers(stream);
    })
    .catch((error) => {
      console.error("Stream not found: ", error);
    });
}

const endStream = (stream) => {
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
}

const localStreamReducer = (state, action) => {
  switch (action.type) {
    case 'stream':
      const audioState = action.value.stream ? action.value.stream.getAudioTracks()[0].enabled : false;
      const videoState = action.value.stream ? action.value.stream.getVideoTracks()[0].enabled : false;
      return {stream: action.value.stream, desk: state.desk, mic: audioState, cam: videoState};
    case 'desk':
      if(!action.value.desk) {
        endStream(state.desk);
      }
      return {stream: state.stream, desk: action.value.desk, mic: state.mic, cam: state.cam};
    case 'audio':
      muteAudio(action.value.dataChannel, state.stream, state.mic);
      return {stream: state.stream, desk: state.desk, mic: !state.mic, cam: state.cam};
    case 'video':
      muteVideo(action.value.dataChannel, state.stream, state.cam);
      return {stream: state.stream, desk: state.desk, mic: state.mic, cam: !state.cam};
    case 'end':
      if(state.desk) {
        endStream(state.desk);
      }
      endStream(state.stream);
      return {stream: false, desk: false, mic: true, cam: true}
    default:
      throw new Error();
  }
}

const remoteStreamsReducer = (state, action) => {
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
    case 'mute':
      const user = state.users.find(item => item.id === action.value.id);
      let track = null;
      if(action.value.trackType === 'audio') {
        track = user.stream.getAudioTracks()[0];
      }
      if(action.value.trackType === 'video') {
        track = user.stream.getVideoTracks()[0];
      }
      if (track) {
        track.enabled = !action.value.muted;
      }
      return {users: state.users, desk: state.desk};
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
  const socket = useRef(null);
  const pc = useRef({}); // For RTCPeerConnection Objects
  const dataChannel = useRef({}); 
  const [localStreamState, localStreamDispatch] = useReducer(localStreamReducer, 
    {stream: false, desk: false, mic: true, cam: true});
  const [remoteStreamsState, remoteStreamsDispatch] = useReducer(remoteStreamsReducer,
    {users: [], desk: []});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const sendData = (data) => {
    socket.current.emit("data", {
      username: localUsername,
      room: roomName,
      data: data,
    });
  };

  const endConnection = () => {
    socket.current.emit("leave", { username: localUsername, room: roomName });
    socket.current.close();
    for (let sid in pc.current) {
      pc.current[sid].close();
    }
    remoteStreamsDispatch({type: 'empty'});
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
    remoteStreamsDispatch({type: 'add', value: {id: sid, stream: event.stream}});
  };}

  const onRemoveStream = (sid) => {
    return (event) => {
    console.log("Delete remote stream");
    remoteStreamsDispatch({type: 'removeDemo', value: sid});
  };}

  const createPeerConnection = (sid) => {
    try {
      pc.current[sid] = new RTCPeerConnection(STUN_SERVERS);
      pc.current[sid].onicecandidate = onIceCandidate(sid);
      pc.current[sid].onaddstream = onAddStream(sid);
      pc.current[sid].onremovestream = onRemoveStream(sid);
      pc.current[sid].addStream(localStreamState.stream);
      dataChannel.current[sid] = pc.current[sid].createDataChannel('my-channel');
      dataChannel.current[sid].onopen = () => console.log('Data channel is open');
      pc.current[sid].ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onopen = () => console.log('Data channel is open for recieving');
        dataChannel.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'mute-track') {
            remoteStreamsDispatch({type: 'mute', value: {id: sid, trackType: message.trackType, muted: message.muted}});
          }
        };
      };
      if(localStreamState.desk) {
        pc.current[sid].addStream(localStreamState.desk);
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClosing);
    socket.current = socketio(host, connectionOptions);
    socket.current.on("room_full", () => {
      console.log("Room is full!");
      localStreamDispatch({type: 'end'});
      endConnection();
    });
    socket.current.on("leave", (username) => {
      console.log("Disconnect!");
      pc.current[username].close();
      remoteStreamsDispatch({type: 'remove', value: username});
      setSnackbarMessage(username + " left")
      setOpenSnackbar(true);
    });
    streamLocal(localStreamDispatch);
    return function cleanup() {
      endConnection();
      window.removeEventListener('beforeunload', handleTabClosing);
    };
  }, []);

  useEffect(() => {
    if(localStreamState.stream){
      socket.current.on("ready", (username) => {
        console.log("Ready to Connect!");
        createPeerConnection(username);
        sendOffer(username);
        setSnackbarMessage(username + " joined")
        setOpenSnackbar(true);
      });
      socket.current.on("data", (data, username) => {
        signalingDataHandler(data, username);
      });
      socket.current.connect();
      socket.current.emit("join", { username: localUsername, room: roomName });
    }
  }, [localStreamState.stream]);
  
  const renderVideos = (videos) => {
    return videos.map(item => 
      <Grid key={item.id} item xs={6}>
        <UserVideo stream={item.stream}/>
      </Grid>);
  };

  const handleDesk = () => {
    const addStreamToPeers = (stream) => {
      for (let sid in pc.current) {
        pc.current[sid].addStream(stream);
        sendOffer(sid);
      }
    }
    if(localStreamState.desk) {
      for (let sid in pc.current) {
        pc.current[sid].removeStream(localStreamState.desk);
        sendOffer(sid);
      }
      localStreamDispatch({type: 'desk', value: {desk: false} })
    } else {
      streamDesk(localStreamDispatch, addStreamToPeers);
    }
  } 

  const handleEndCall = () => {
    localStreamDispatch({type: 'end'});
    endConnection();
    navigate("/");
  }

  return (
    <Container component="main">
      <CssBaseline />
      <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
      >
      <Typography>{"Username: " + localUsername}</Typography>
      <Typography>{"Room Id: " + roomName}</Typography>
      <Container maxWidth='md' margin="normal">
        <Grid container spacing={2} justifyContent="center" 
        sx={{
              marginBottom: 2
        }}>
          <Grid item xs={6}>
            <UserVideo stream={localStreamState.stream} muted/> 
          </Grid>
          {renderVideos(remoteStreamsState.users)}
        </Grid>
        <Container>
          {localStreamState.desk? <VideoItem stream={localStreamState.desk} muted/> : <></>}
          {renderVideos(remoteStreamsState.desk)}
        </Container>
      </Container>
      <ButtonGroup color="primary" variant="outlined" aria-label="outlined button group">
      <Button onClick={() => localStreamDispatch({type: 'video', value: {dataChannel: dataChannel.current} })} 
        sx={{"color": localStreamState.cam?"green":"red"}}>Video</Button>
      <Button onClick={() => localStreamDispatch({type: 'audio', value: {dataChannel: dataChannel.current}})} 
        sx={{"color": localStreamState.mic?"green":"red"}}>Audio</Button>
      <Button onClick={handleDesk} sx={{"color": localStreamState.desk?"green":"red"}}>Stream</Button>
      <Button onClick={handleEndCall} sx={{"color": "red"}}>End</Button>
      </ButtonGroup>
      </Box>
      <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CallScreen;