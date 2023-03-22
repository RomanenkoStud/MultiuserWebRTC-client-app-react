import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DeskVideo from "../components/DeskVideo";
import { CssBaseline, Box, Container, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import UserVideo from '../components/UserVideo/UserVideo';
import { useLogoAnimation } from '../hooks/useLogoAnimation';
import Chat from "../components/Chat";
import Camera  from "../components/UserMediaInputs/Camera";
import ScreenSharing from "../components/UserMediaInputs/ScreenSharing";
import { useWebRTC } from "../hooks/useWebRTC";
import ControlPanel from "../components/ControlPanel";
import ParticipantsList from "../components/ParticipantsList";
import Carousel from 'react-material-ui-carousel';

const host = "https://azure-flask-socketio.azurewebsites.net/";

const userVideo = (user) => {
  return (<UserVideo stream={user.stream} username={user.id}/>);
};

const deskVideos = (deskArray) => {
  return deskArray.map((desk) => (
    <DeskVideo key={desk.id} stream={desk.stream} username={desk.id}/>
  ))
}

function VideosLayout({userCamera, users}) {
  return(
  <Grid container spacing={1} justifyContent="center">
    {/* Main */}
    <Grid item sm={4}>
      {userCamera}
    </Grid>
    {users[0] ? 
    (<Grid item sm={4}>
      {userVideo(users[0])}
    </Grid>) : null}
    {/* Side videos */}
    {users[1] ?
    (<Grid item sm={2}>
      <Grid container spacing={1}>
        {users[1] ?
        (<Grid item sm={12}>
          {userVideo(users[1])}
        </Grid>) : null}
        {users[2] ?
        (<Grid item sm={12}>
          {userVideo(users[2])}
        </Grid>) : null}
      </Grid>
    </Grid>): null}
  </Grid>);
}

function VideosLayoutWithDesk({userCamera, userDesk, users, desk}) {
  const allDesk = (local, remoteArray) => {
    if (local && remoteArray[0]) {
      return [local, ...deskVideos(remoteArray)];
    } else if (local) {
      return [local];
    } else if (remoteArray[0]) {
      return deskVideos(remoteArray);
    } else {
      return null;
    }
  }

  return(
  <Grid container spacing={1} justifyContent="center">
    {/* Main */}
    <Grid item sm={8}>
      <Carousel 
        navButtonsWrapperProps={{ 
          style: {
              top: '40px'
          }
        }} 
        autoPlay={false}
        indicatorContainerProps={{ style: { display: 'none' } }}
      >
        {allDesk(userDesk, desk)}
      </Carousel>
    </Grid>
    {/* Side videos */}
    <Grid item sm={2}>
      <Grid container spacing={1}>
        <Grid item sm={12}>
          {userCamera}
        </Grid>
        {users[0] ?
        (<Grid item sm={12}>
          {userVideo(users[0])}
        </Grid>) : null}
      </Grid>
    </Grid>
    {users[1] ?
    (<Grid item sm={2}>
      <Grid container spacing={1}>
        {users[1] ?
        (<Grid item sm={12}>
          {userVideo(users[1])}
        </Grid>) : null}
        {users[2] ?
        (<Grid item sm={12}>
          {userVideo(users[2])}
        </Grid>) : null}
      </Grid>
    </Grid>): null}
  </Grid>);
}

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
  const [sidebar, setSidebar] = useState(false);
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

  const getParticipants = (connections) => {
    return [localUsername, ...connections.map((item) => { return item.id })];
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
    <Container component="main" maxWidth='xl'>
      <CssBaseline />
      <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
      >
      <Container maxWidth='xl'>
        {deskState||remoteStreamsState.desk[0] ?
        (<VideosLayoutWithDesk 
          userCamera={<Camera stream={localStreamState.stream} setStream={setCameraStream}/>} 
          userDesk={deskState? <ScreenSharing 
            setStream={setDeskStream} 
            onCancel={() => setDeskState(false)}/> : false} 
            users={remoteStreamsState.users} 
            desk={remoteStreamsState.desk[0] ? remoteStreamsState.desk : false}
        />) :
        (<VideosLayout 
          userCamera={<Camera stream={localStreamState.stream} setStream={setCameraStream}/>} 
          users={remoteStreamsState.users}
        />)
        }
      </Container>
      <Chat 
        isOpen={chatOpen} 
        onClose={handleChatClose} 
        socket={socket.current} 
        localUsername={localUsername}
        roomName={roomName}
      />
      <ParticipantsList participants={getParticipants(remoteStreamsState.users)} isOpen={sidebar} onClose={()=>setSidebar(false)}/>
      <ControlPanel cameraEnabled={localStreamState.cam} handleCamera={handleVideo} 
        micEnabled={localStreamState.mic} handleMic={handleAudio} 
        screenSharing={localStreamState.desk} handleScreenSharing={handleDesk}
        handleChat={handleChatOpen} handleParticipants={()=>setSidebar(!sidebar)} 
        handleEndCall={handleEndCall}/>
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