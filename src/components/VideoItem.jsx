import { useRef, useEffect } from "react";
import { IconButton } from '@mui/material';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import './VideoItem.css';

const videoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

function VideoItem({stream, muted, hidden, fullScreen}) {
  const remoteVideoRef = useRef(null);

  const handleFullScreen = () => {
    if (remoteVideoRef.current.requestFullscreen) {
      remoteVideoRef.current.requestFullscreen();
    }
  };

  const handleExitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const isFullScreen = document.fullscreenElement !== null;

  useEffect(() => {
    if(stream !== null) {
      remoteVideoRef.current.srcObject = stream;
    }
  }, [stream]);
  if(fullScreen) {
    return (
      <div style={hidden ? { display: "none" } : { position: "relative", ...videoStyle }}>
        <IconButton
          onClick={isFullScreen ? handleExitFullScreen : handleFullScreen}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
            color: "white",
          }}
        >
          {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
        <video
          style={videoStyle}
          muted={muted}
          autoPlay
          playsInline
          ref={remoteVideoRef}
        />
      </div>
    );
  } else {
    return (
      <video 
        style={hidden ? {display: "none"} : videoStyle} 
        muted={muted} 
        autoPlay playsInline ref={remoteVideoRef} 
      />
    );
  }
}

export default VideoItem;