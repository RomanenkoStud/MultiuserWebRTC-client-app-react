import {
    ButtonGroup,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Badge,
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
    MoreVert,
    Notifications,
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useState } from "react";

const MediaButton = ({name, state, onIcon, offIcon, onClick}) => {
    return (
        <Tooltip title={state ? `Disable ${name}` : `Enable ${name}`}>
            <IconButton onClick={onClick}>
            {state ? onIcon : offIcon}
            </IconButton>
        </Tooltip>
    );
}

const DialogButton = ({name, icon, onClick, badgeContent}) => {
    return (
        <Tooltip title={`Open ${name}`}>
            <IconButton onClick={onClick}>
                <Badge badgeContent={badgeContent} color="error">
                    {icon}
                </Badge>
            </IconButton>
        </Tooltip>
    );
}

const CopyButton = ({text}) => {
    const [isCopied, setIsCopied] = useState(false);
    return (
        <Tooltip title={isCopied ? 'Copied!' : 'Copy to clipboard'}>
            <IconButton>
                <CopyToClipboard text={text} onCopy={() => setIsCopied(true)}>
                    <Share />
                </CopyToClipboard>
            </IconButton>
        </Tooltip>
    );
}

const ControlPanel = ({
    cameraEnabled, handleCamera, 
    micEnabled, handleMic, 
    blurEnabled, handleBlur,
    screenSharing, handleScreenSharing,
    handleChat, handleParticipants,
    notifications, 
    handleNotifications,
    handleEndCall, invite}) => {
    const theme = useTheme();
    const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMoreClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    const mobileMenu = (
        <Menu
                id="more-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMoreClose}
            >
                <MenuItem onClick={handleBlur} >
                    {blurEnabled ? <BlurOn /> : <BlurOff />}
                </MenuItem>
                <MenuItem onClick={handleScreenSharing}>
                    {screenSharing ? <StopScreenShare /> : <ScreenShare />}
                </MenuItem>
                <MenuItem>
                    <CopyToClipboard text={invite}>
                        <Share />
                    </CopyToClipboard>
                </MenuItem>
            </Menu>
    );
    
    return (
            <ButtonGroup 
            sx={{
                position: 'fixed',
                bottom: 15,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: (theme) => theme.palette.primary.light,
                borderRadius: 15,
                px: 5,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            }}>
            <MediaButton name="Camera" state={cameraEnabled} onIcon={<Videocam />} offIcon={<VideocamOff />} onClick={handleCamera}/>
            <MediaButton name="Mic" state={micEnabled} onIcon={<Mic />} offIcon={<MicOff />} onClick={handleMic}/>
            {!matchesMd && (<>
                <MediaButton name="Blur" state={blurEnabled} onIcon={<BlurOff />} offIcon={<BlurOn/>} onClick={handleBlur}/>
                <MediaButton name="Sharing" state={screenSharing} onIcon={<StopScreenShare />} offIcon={<ScreenShare />} onClick={handleScreenSharing}/>
            </>)}
            <DialogButton name="Chat" icon={<Chat />} onClick={handleChat}/>
            <DialogButton name="Participants" icon={<People />} onClick={handleParticipants}/>
            <DialogButton name="Notifications" icon={<Notifications />} badgeContent={notifications.length} onClick={handleNotifications}/>
            <Tooltip title="End Call">
                <IconButton onClick={handleEndCall}>
                <CallEnd />
                </IconButton>
            </Tooltip>
            {!matchesMd && (
                <CopyButton text={invite}/>
            )}
            {matchesMd && <Tooltip title="More">
                <IconButton onClick={handleMoreClick}>
                    <MoreVert />
                </IconButton>
            </Tooltip>}
            {mobileMenu}
            </ButtonGroup>
    );
};

export default ControlPanel;