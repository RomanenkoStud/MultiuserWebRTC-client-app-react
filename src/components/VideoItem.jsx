import { useRef, useEffect } from "react";

const videoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

function VideoItem({stream, muted, hidden}) {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if(stream !== null) {
      remoteVideoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video 
      style={hidden ? {display: "none"} : videoStyle} 
      muted={muted} 
      autoPlay playsInline ref={remoteVideoRef} 
    />
  );
}

export default VideoItem;