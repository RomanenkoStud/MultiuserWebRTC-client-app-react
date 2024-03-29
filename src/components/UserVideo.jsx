import VideoItem from "./VideoItem";
import { 
    Paper, 
    Skeleton, 
    Box, 
    Avatar, 
} from '@mui/material';
import { Mic, MicOff as MicOffIcon} from '@mui/icons-material';
import ConnectionIcon from "./ConnectionIcon";
import { useSpeakingDetector } from "../hooks/useSpeakingDetector";

function UserVideoPlaceholder({user, children}) {
    return (
        <Box sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: "translateZ(0)", 
                    // force whole pixel rendering
                    // prevent sub-pixel rendering
                bgcolor: (theme) => theme.palette.primary.dark,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                }} >
            <Avatar sx={{ bgcolor: 'default', width: '50%', height: '50%'  }} image={user.imageUrl}>
                {user.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile"
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                    }}/>
                ) : 
                    user.username.charAt(0).toUpperCase()
                }
            </Avatar>
            {children}
        </Box>
    );
}

function UserVideo({stream, muted, user, peerConnection}) {
    const audioState = stream ? stream.getAudioTracks()[0]?.enabled : false;
    const videoState = stream ? stream.getVideoTracks()[0]?.enabled : false;
    const isSpeaking = useSpeakingDetector(stream);

    const shadowColor = 'rgba(33, 78, 40, 0.5)';
    const shadowThickness = isSpeaking ? 20 : 3;

    const color="primary";
    return (
        <Paper elevation={3} 
            sx={{overflow: 'hidden', aspectRatio : '1 / 1', position: 'relative',
            boxShadow: `${shadowColor} 0px 0px ${shadowThickness}px`,
            }}
        >
            {stream ? 
                (videoState ? 
                    <VideoItem stream={stream} muted={muted}/> : 
                    <UserVideoPlaceholder user={user}>
                        <VideoItem stream={stream} muted={muted} hidden/>
                    </UserVideoPlaceholder>
                ) : 
                    <Skeleton variant="rectangular" 
                            sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                            }} 
                    />
            }
            <Box 
            sx={{
                position: 'absolute',
                bottom: 0,
                right: 5,
            }}>
                {audioState ? <Mic color={color}/> : <MicOffIcon color={color}/>}
                {peerConnection && <ConnectionIcon peerConnection={peerConnection} color={color}/>}
            </Box>
        </Paper>
    );
}

export default UserVideo;