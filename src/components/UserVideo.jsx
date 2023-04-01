import VideoItem from "./VideoItem";
import { 
    Paper, 
    Skeleton, 
    Chip, 
    Box, 
    Avatar, 
    Typography 
} from '@mui/material';
import { Mic, MicOff as MicOffIcon} from '@mui/icons-material';
import { useSpeakingDetector } from "../hooks/useSpeakingDetector";

function UserVideoPlaceholder(props) {
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
            <Avatar sx={{ bgcolor: 'default', width: '50%', height: '50%'  }}>
                <Typography sx={{ fontSize: 40 }}>{props.username}</Typography>
            </Avatar>
            {props.children}
        </Box>
    );
}

function UserVideo(props) {
    const audioState = props.stream ? props.stream.getAudioTracks()[0]?.enabled : false;
    const videoState = props.stream ? props.stream.getVideoTracks()[0]?.enabled : false;
    const isSpeaking = useSpeakingDetector(props.stream);

    const shadowColor = 'rgba(33, 78, 40, 0.5)';
    const shadowThickness = isSpeaking ? 20 : 3;

    return (
        <Paper elevation={3} 
            sx={{overflow: 'hidden', aspectRatio : '1 / 1', position: 'relative',
            boxShadow: `${shadowColor} 0px 0px ${shadowThickness}px`,
            }}
        >
            {props.stream ? 
                (videoState ? 
                    <VideoItem stream={props.stream} muted={props.muted}/> : 
                    <UserVideoPlaceholder username={props.username}>
                        <VideoItem stream={props.stream} muted={props.muted} hidden/>
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
            <Chip color="default"  
            sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
            }}
            icon={audioState ? <Mic /> : <MicOffIcon />}/>
        </Paper>
    );
}

export default UserVideo;