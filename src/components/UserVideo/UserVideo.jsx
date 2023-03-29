import VideoItem from "../VideoItem";
import UserVideoPlaceholder from "./UserVideoPlaceholder";
import { Paper } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Chip } from '@mui/material';
import Mic from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useSpeakingDetector } from "../../hooks/useSpeakingDetector";

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