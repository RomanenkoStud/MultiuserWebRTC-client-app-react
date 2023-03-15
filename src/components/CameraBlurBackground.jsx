import { useRef } from "react";
import { useCameraBlurBackground } from "../hooks/useCameraBlurBackground";
import VideoItem from "./VideoItem";

const CameraBlurBackground = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stream = useCameraBlurBackground(videoRef, canvasRef);

  return (
    <div className="camera-container">
      <VideoItem mediaStream={stream}/>
      <video className="input-video" ref={videoRef} style={{ display: 'none',}}></video>
      <canvas className="output-canvas" style={{ display: 'none',}} ref={canvasRef}></canvas>
    </div>
  );
};

export default CameraBlurBackground;