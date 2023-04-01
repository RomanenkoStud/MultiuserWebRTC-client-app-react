import { useEffect, useState, useRef } from "react";
import { useCameraBlurBackground } from "../../hooks/useCameraBlurBackground";
import UserVideo from "../UserVideo";

const CameraBlurBackground = ({stream, setStream, useMic, useCam}) => {
    const { videoRef, canvasRef, streamLocal, reset } = useCameraBlurBackground();
    const [cameraStream, setCameraStream] = useState(null);
    const [mic, setMic] = useState(useMic);
    const [cam, setCam] = useState(useCam);
    const enabled = useRef(false);

    useEffect(() => {
            if(!enabled.current) {
                streamLocal.current(setCameraStream, mic, cam);
                enabled.current = true;
            }
    }, [stream, mic, cam, streamLocal]);

    useEffect(() => {
        if(enabled.current && (useMic !== mic || useCam !== cam)) {
            reset.current();
            streamLocal.current(setCameraStream, useMic, useCam);
            setMic(useMic);
            setCam(useCam);
        }
}, [stream, mic, cam, useMic, useCam, streamLocal, reset]);

    useEffect(() => {
        if(cameraStream && stream !== cameraStream){
            setStream(cameraStream);
        }
    }, [cameraStream, setStream, stream]);

    return (
    <>
        <UserVideo stream={cameraStream} username="you" muted/> 
        <video className="input-video" ref={videoRef} style={{ display: 'none',}}></video>
        <canvas className="output-canvas" style={{ display: 'none',}} ref={canvasRef}></canvas>
    </>
    );
};

export default CameraBlurBackground;