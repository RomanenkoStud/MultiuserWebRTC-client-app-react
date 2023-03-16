import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoItem from "../components/VideoItem";
import { Button, ButtonGroup } from '@mui/material';
import { CssBaseline, Box, Container, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import UserVideo from '../components/UserVideo/UserVideo';
import { useLogoAnimation } from '../hooks/useLogoAnimation';
import Chat from "../components/Chat";
import Camera  from "../components/UserMediaInputs/Camera";
import ScreenSharing from "../components/UserMediaInputs/ScreenSharing";
import { useWebRTC } from "../hooks/useWebRTC";

const host = "http://localhost:5000/";

function CallScreen() {
  const params = useParams();
  const localUsername = params.username;
  const roomName = params.room;
  const { 
    socket, localStreamState, remoteStreamsState, 
    setCameraStream, handleVideo, handleAudio, setDeskStream,
    showMessage, setShowMessage, message, endConnection
  } = useWebRTC(host, localUsername, roomName);
  const [chatOpen, setChatOpen] = useState(false);
  const [deskState, setDeskState] = useState(false);
  const { navigate } = useLogoAnimation();

  useEffect(() => {
    if(!deskState && localStreamState.desk){
      setDeskStream(false);
    }
  }, [deskState]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowMessage(false);
  };

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };
  
  const renderUserVideos = (videos) => {
    return videos.map(item => 
      <Grid key={item.id} item xs={6}>
        <UserVideo stream={item.stream} username={item.id}/>
      </Grid>);
  };

  const renderVideos = (videos) => {
    return videos.map(item => 
      <Grid key={item.id} item xs={6}>
        <VideoItem stream={item.stream}/>
      </Grid>);
  };

  const handleDesk = () => {
    if(deskState) {
      setDeskState(false);
    } else {
      setDeskState(true);
    }
  } 

  const handleEndCall = () => {
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
            <Camera setStream={setCameraStream}/> 
          </Grid>
          {renderUserVideos(remoteStreamsState.users)}
        </Grid>
        <Container>
          {deskState? <ScreenSharing setStream={setDeskStream}/> : <></>}
          {renderVideos(remoteStreamsState.desk)}
        </Container>
      </Container>
      <Chat 
        isOpen={chatOpen} 
        onClose={handleChatClose} 
        socket={socket.current} 
        localUsername={localUsername}
        roomName={roomName}
      />
      <ButtonGroup color="primary" variant="outlined" aria-label="outlined button group">
      <Button onClick={handleVideo} 
        sx={{"color": localStreamState.cam?"green":"red"}}>Video</Button>
      <Button onClick={handleAudio} 
        sx={{"color": localStreamState.mic?"green":"red"}}>Audio</Button>
      <Button onClick={handleDesk} sx={{"color": deskState?"green":"red"}}>Stream</Button>
      <Button color="primary" onClick={handleChatOpen}>Open Chat</Button>
      <Button onClick={handleEndCall} sx={{"color": "red"}}>End</Button>
      </ButtonGroup>
      </Box>
      <Snackbar
          open={showMessage}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CallScreen;