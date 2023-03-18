import VideoItem from "./VideoItem";
import { Paper } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Chip } from '@mui/material';

function DeskVideo(props) {

    return (
        <div style={{ lineHeight: 0 }}>
        <Paper elevation={3} 
            sx={{overflow: 'hidden', position: 'relative', aspectRatio: "16/8"
            }}
        >
            {props.stream ? 
                <VideoItem stream={props.stream} muted={props.muted} fullScreen/> : 
                <Skeleton variant="rectangular" 
                        sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                        }} 
                />
            }
            <Chip
            label={"Streaming: " + props.username}
            sx={{
                color: 'gray',
                lineHeight: 10,
                position: 'absolute',
                bottom: 0,
                right: 0,
            }}/>
        </Paper>
        </div>
    );
}

export default DeskVideo;