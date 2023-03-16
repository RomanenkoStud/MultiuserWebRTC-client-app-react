import { useEffect } from "react";
import { useCameraBlurBackground } from "../../hooks/useCameraBlurBackground";
import UserVideo from "../UserVideo/UserVideo";

const CameraBlurBackground = ({setStream}) => {
    const { videoRef, canvasRef, stream } = useCameraBlurBackground();

    useEffect(() => {
        if(stream){
            setStream(stream);
        }
    }, [stream]);

    return (
    <>
        <UserVideo stream={stream} username="you" muted/> 
        <video className="input-video" ref={videoRef} style={{ display: 'none',}}></video>
        <canvas className="output-canvas" style={{ display: 'none',}} ref={canvasRef}></canvas>
    </>
    );
};

export default CameraBlurBackground;