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

//const host = "http://localhost:8000/";
const host = "https://azure-flask-socketio.azurewebsites.net/";

const userVideo = (user, userInfo) => {
    return (<UserVideo stream={user.stream} user={userInfo}/>);
};

const deskVideos = (deskArray, userInfo) => {
    return deskArray.map((desk) => (
        <DeskVideo key={desk.id} stream={desk.stream} user={userInfo[desk.id]}/>
    ))
}

function VideosLayout({userCamera, users, usersInfo}) {
    const matchesSM = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const userInfo = (i) => {
        return usersInfo[users[i].id];
    }
    return(
    <Grid container spacing={1} justifyContent={matchesSM ? "start" : "center"}>
        {/* Main */}
        <Grid item xs={12} sm={6} md={4}>
        {userCamera}
        </Grid>
        {users[0] ? 
        (<Grid item xs={4} sm={6} md={4}>
        {userVideo(users[0], userInfo(0))}
        </Grid>) : null}
        {/* Side videos */}
        {users[1] ?
        (<Grid item xs={8} sm={12} md={2}>
        <Grid container spacing={1}>
            {users[1] ?
            (<Grid item xs={6} sm={3} md={12}>
            {userVideo(users[1], userInfo(1))}
            </Grid>) : null}
            {users[2] ?
            (<Grid item xs={6} sm={3} md={12}>
            {userVideo(users[2], userInfo(2))}
            </Grid>) : null}
        </Grid>
        </Grid>): null}
    </Grid>);
}

function VideosLayoutWithDesk({userCamera, userDesk, users, desk, usersInfo}) {
    const allDesk = (local, remoteArray) => {
        if (local && remoteArray[0]) {
        return [local, ...deskVideos(remoteArray, usersInfo)];
        } else if (local) {
        return [local];
        } else if (remoteArray[0]) {
        return deskVideos(remoteArray, usersInfo);
        } else {
        return null;
        }
    }

    const userInfo = (id) => {
        return usersInfo[users[id].id];
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
            {userVideo(users[0], userInfo(0))}
            </Grid>) : null}
        </Grid>
        </Grid>
        {users[1] ?
        (<Grid item xs={12} sm={6} md={2}>
        <Grid container spacing={1}>
            {users[1] ?
            (<Grid item xs={6} sm={6} md={12}>
            {userVideo(users[1], userInfo(1))}
            </Grid>) : null}
            {users[2] ?
            (<Grid item xs={6} sm={6} md={12}>
            {userVideo(users[2], userInfo(2))}
            </Grid>) : null}
        </Grid>
        </Grid>): null}
    </Grid>);
}

function InCallView({user, room, settings, onEnd}) {
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
    usersInfo,
    setCameraStream, 
    handleVideo, 
    handleAudio, 
    setDeskStream, 
    endConnection
    } = useWebRTC(host, user, room.id, settings, addNotification);
const [chatOpen, setChatOpen] = useState(false);
const [deskState, setDeskState] = useState(false);
const [sidebar, setSidebar] = useState(false);
const latestStreamValue = useRef(null);
const latestStreamPromise = useRef(null);

const onResult = (transcript) => {
    console.log("message: " + transcript)
    socket.current.emit('user_speech', { username: user.id, room: room.id, transcript: transcript });
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

const getParticipants = () => {
    return [user, ...Object.values(usersInfo.current)];
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
            user={user}
        />
        );
    } else {
        return (
        <Camera
            stream={localStreamState.stream} 
            setStream={setCameraStream.current}
            useMic={localStreamState.mic}
            useCam={localStreamState.cam}
            user={user}
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
                onCancel={() => setDeskState(false)}
                user={user}/> : false
            } 
            users={remoteStreamsState.users} 
            usersInfo={usersInfo.current}
            desk={remoteStreamsState.desk[0] ? remoteStreamsState.desk : false}
        />) :
        (<VideosLayout 
        userCamera={renderCamera()} 
        users={remoteStreamsState.users}
        usersInfo={usersInfo.current}
        />)
        }
    </Container>
    <Chat 
        isOpen={chatOpen} 
        onClose={handleChatClose} 
        socket={socket.current} 
        localUsername={user.id}
        roomName={room.id}
    />
    <ParticipantsList participants={getParticipants()} isOpen={sidebar} onClose={()=>setSidebar(false)}/>
    <ControlPanel cameraEnabled={localStreamState.cam} handleCamera={handleVideo} 
        micEnabled={localStreamState.mic} handleMic={handleAudio} 
        blurEnabled={useBlur} handleBlur={()=>setUseBlur(!useBlur)} 
        screenSharing={localStreamState.desk} handleScreenSharing={handleDesk}
        handleChat={handleChatOpen} handleParticipants={()=>setSidebar(!sidebar)} 
        notifications={notifications}
        handleNotifications={()=> setIsNotificationsOpen(!isNotificationsOpen)}
        handleEndCall={handleEndCall} invite={`${window.location.origin}/rooms/invite/${room.id}`} />
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