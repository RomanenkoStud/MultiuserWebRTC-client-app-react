import { useRef, useEffect } from "react";

const videoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

function VideoItem(props) {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if(props.stream !== null)
      remoteVideoRef.current.srcObject = props.stream;
  }, []);

  return (
    <video style={videoStyle} muted={props.muted} autoPlay playsInline ref={remoteVideoRef} />
  );
}

export default VideoItem;