import VideoItem from "./VideoItem";
import { Paper, Skeleton, Chip } from '@mui/material';

function DeskVideo({stream, muted, user}) {

    return (
        <div style={{ lineHeight: 0 }}>
        <Paper elevation={3} 
            sx={{overflow: 'hidden', position: 'relative', aspectRatio: "16/8"
            }}
        >
            {stream ? 
                <VideoItem stream={stream} muted={muted} fullScreen/> : 
                <Skeleton variant="rectangular" 
                        sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                        }} 
                />
            }
            <Chip
            label={"Streaming: " + user.username}
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