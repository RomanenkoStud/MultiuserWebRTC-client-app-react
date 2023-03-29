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
    Share,
    BlurOn,
    BlurOff,
} from '@mui/icons-material';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useState } from "react";

const ControlPanel = ({
    cameraEnabled, handleCamera, 
    micEnabled, handleMic, 
    blurEnabled, handleBlur,
    screenSharing, handleScreenSharing,
    handleChat, handleParticipants,
    handleEndCall, invite}) => {
    const [isCopied, setIsCopied] = useState(false);

    return (
            <ButtonGroup sx={{
                position: 'fixed',
                bottom: 15,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: (theme) => theme.palette.primary.light,
                borderRadius: 15,
                px: 5,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            }}>
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
            <Tooltip title={cameraEnabled ? 'Disable Blur' : 'Enable Blur'}>
                <IconButton onClick={handleBlur}>
                {blurEnabled ? <BlurOn /> : <BlurOff />}
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
            <CopyToClipboard text={invite} onCopy={() => setIsCopied(true)}>
                <Tooltip title={isCopied ? 'Copied!' : 'Copy to clipboard'}>
                    <IconButton>
                        <Share />
                    </IconButton>
                </Tooltip>
            </CopyToClipboard>
            </ButtonGroup>
    );
};

export default ControlPanel;