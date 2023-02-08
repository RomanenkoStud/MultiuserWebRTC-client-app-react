import { useRef, useEffect } from "react";

function VideoItem(props) {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if(props.stream !== null)
      remoteVideoRef.current.srcObject = props.stream;
  }, []);

  return (
    <video autoPlay muted playsInline ref={remoteVideoRef} />
  );
}

export default VideoItem;