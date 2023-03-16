import {
    ButtonGroup,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Chat,
    Mic,
    MicOff,
    Videocam,
    VideocamOff,
    ScreenShare,
    StopScreenShare,
    People,
    CallEnd,
} from '@mui/icons-material';

const ControlPanel = ({
    cameraEnabled, handleCamera, 
    micEnabled, handleMic, 
    screenSharing, handleScreenSharing,
    handleChat, handleParticipants,
    handleEndCall,}) => {
    

    return (
            <ButtonGroup>
            <Tooltip title={cameraEnabled ? 'Disable Camera' : 'Enable Camera'}>
                <IconButton onClick={handleCamera}>
                {cameraEnabled ? <Videocam /> : <VideocamOff />}
                </IconButton>
            </Tooltip>
            <Tooltip title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}>
                <IconButton onClick={handleMic}>
                {micEnabled ? <Mic /> : <MicOff />}
                </IconButton>
            </Tooltip>
            <Tooltip title={screenSharing ? 'Stop Sharing' : 'Start Sharing'}>
                <IconButton onClick={handleScreenSharing}>
                {screenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
            </Tooltip>
            <Tooltip title="Open Chat">
                <IconButton onClick={handleChat}>
                <Chat />
                </IconButton>
            </Tooltip>
            <Tooltip title="Open Participants">
                <IconButton onClick={handleParticipants}>
                <People />
                </IconButton>
            </Tooltip>
            <Tooltip title="End Call">
                <IconButton onClick={handleEndCall}>
                <CallEnd />
                </IconButton>
            </Tooltip>
            </ButtonGroup>
    );
};

export default ControlPanel;