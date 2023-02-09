import { useRef, useEffect } from "react";

function VideoItem(props) {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if(props.stream !== null)
      remoteVideoRef.current.srcObject = props.stream;
  }, []);

  return (
    <video className={props.type} autoPlay playsInline ref={remoteVideoRef} />
  );
}

export default VideoItem;