import { useEffect, useState, useRef, useCallback } from "react";
import { 
    CssBaseline, 
    Box, 
    Container, 
    Grid, 
    useMediaQuery, 
} from '@mui/material';
import DeskVideo from "../components/DeskVideo";
import UserVideo from '../components/UserVideo';
import Chat from "../components/Chat";
import ControlPanel from "../components/ControlPanel";
import ParticipantsList from "../components/ParticipantsList";
import { 
    Camera, 
    CameraBlurBackground, 
    ScreenSharing
}  from "../components/UserMediaInputs/UserMediaInputs";
import { useWebRTC } from "../hooks/useWebRTC";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import Carousel from 'react-material-ui-carousel';
import NotificationPanel from "../components/NotificationPanel";

const host = "http://localhost:8000/";
//const host = "https://azure-flask-socketio.azurewebsites.net/";

const userVideo = (user) => {
    return (<UserVideo stream={user.stream} username={user.id}/>);
};

const deskVideos = (deskArray) => {
    return deskArray.map((desk) => (
        <DeskVideo key={desk.id} stream={desk.stream} username={desk.id}/>
    ))
}

function VideosLayout({userCamera, users}) {
    const matchesSM = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return(
    <Grid container spacing={1} justifyContent={matchesSM ? "start" : "center"}>
        {/* Main */}
        <Grid item xs={12} sm={6} md={4}>
        {userCamera}
        </Grid>
        {users[0] ? 
        (<Grid item xs={4} sm={6} md={4}>
        {userVideo(users[0])}
        </Grid>) : null}
        {/* Side videos */}
        {users[1] ?
        (<Grid item xs={8} sm={12} md={2}>
        <Grid container spacing={1}>
            {users[1] ?
            (<Grid item xs={6} sm={3} md={12}>
            {userVideo(users[1])}
            </Grid>) : null}
            {users[2] ?
            (<Grid item xs={6} sm={3} md={12}>
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
        <Grid item xs={12} sm={12} md={8}>
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
        <Grid item xs={12} sm={6} md={2}>
        <Grid container spacing={1}>
            <Grid item xs={6} sm={6} md={12}>
            {userCamera}
            </Grid>
            {users[0] ?
            (<Grid item xs={6} sm={6} md={12}>
            {userVideo(users[0])}
            </Grid>) : null}
        </Grid>
        </Grid>
        {users[1] ?
        (<Grid item xs={12} sm={6} md={2}>
        <Grid container spacing={1}>
            {users[1] ?
            (<Grid item xs={6} sm={6} md={12}>
            {userVideo(users[1])}
            </Grid>) : null}
            {users[2] ?
            (<Grid item xs={6} sm={6} md={12}>
            {userVideo(users[2])}
            </Grid>) : null}
        </Grid>
        </Grid>): null}
    </Grid>);
}

function InCallView({username, room, settings, onEnd}) {
const localUsername = username;
const roomName = room;
const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
const [notifications, setNotifications] = useState([]);
const addNotification = useCallback((message, severity, link) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(
        (prevNotifications) => [...prevNotifications,{ id, open: true, message, severity, link }]
    );
}, [setNotifications]);
const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
    );
};
const [useBlur, setUseBlur] = useState(settings.blur);
const { 
    socket, 
    localStreamState, 
    remoteStreamsState, 
    setCameraStream, 
    handleVideo, 
    handleAudio, 
    setDeskStream, 
    endConnection
    } = useWebRTC(host, localUsername, roomName, settings, addNotification);
const [chatOpen, setChatOpen] = useState(false);
const [deskState, setDeskState] = useState(false);
const [sidebar, setSidebar] = useState(false);
const latestStreamValue = useRef(null);
const latestStreamPromise = useRef(null);

const onResult = (transcript) => {
    console.log("message: " + transcript)
    socket.current.emit('user_speech', { username: localUsername, room: roomName, transcript: transcript });
}
useSpeechRecognition(localStreamState.mic, 'en-US', onResult);

useEffect(() => {
    /*socket.current.on("fact", (hint) => {
        console.log("fact!", hint);
        addNotification(hint, 'info');
    });*/
    socket.current.on("news", (hints) => {
        addNotification(hints[0][0], 'info', hints[0][1]);
    });
}, [socket, addNotification]);

useEffect(() => {
    if(!deskState && localStreamState.desk){
    setDeskStream.current(false);
    }
}, [deskState, localStreamState.desk, setDeskStream]);

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
    endConnection.current();
    onEnd();
}

const renderCamera = () => {
    if(useBlur && localStreamState.cam) {
        return (
        <CameraBlurBackground 
            stream={localStreamState.stream} 
            setStream={setCameraStream.current}
            useMic={localStreamState.mic}
            useCam={localStreamState.cam}
        />
        );
    } else {
        return (
        <Camera
            stream={localStreamState.stream} 
            setStream={setCameraStream.current}
            useMic={localStreamState.mic}
            useCam={localStreamState.cam}
            latestStreamValue={latestStreamValue}
            latestStreamPromise={latestStreamPromise}
        />
        );
    }
}

return (
    <Container component="main" maxWidth='xl'>
    <CssBaseline />
    <Box
                sx={{
                marginTop: "5%",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
    >
    <Container maxWidth='xl'>
        {deskState||remoteStreamsState.desk[0] ?
        (<VideosLayoutWithDesk 
        userCamera={renderCamera()} 
        userDesk={deskState? <ScreenSharing 
            setStream={setDeskStream.current} 
            onCancel={() => setDeskState(false)}/> : false} 
            users={remoteStreamsState.users} 
            desk={remoteStreamsState.desk[0] ? remoteStreamsState.desk : false}
        />) :
        (<VideosLayout 
        userCamera={renderCamera()} 
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
        blurEnabled={useBlur} handleBlur={()=>setUseBlur(!useBlur)} 
        screenSharing={localStreamState.desk} handleScreenSharing={handleDesk}
        handleChat={handleChatOpen} handleParticipants={()=>setSidebar(!sidebar)} 
        notifications={notifications}
        handleNotifications={()=> setIsNotificationsOpen(!isNotificationsOpen)}
        handleEndCall={handleEndCall} invite={`${window.location.origin}/invite/${roomName}`} />
    </Box>
    <NotificationPanel 
        notifications={notifications} 
        removeNotification={removeNotification} 
        isOpen={isNotificationsOpen}
        onClose={()=> setIsNotificationsOpen(false)}
    />
    </Container>
);
}

export default InCallView;