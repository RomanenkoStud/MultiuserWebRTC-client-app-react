import { useEffect, useState, useRef } from "react";
import { useCameraBlurBackground } from "../../hooks/useCameraBlurBackground";
import UserVideo from "../UserVideo";

const CameraBlurBackground = ({stream, setStream, useMic, useCam}) => {
    const { videoRef, canvasRef, streamLocal, reset } = useCameraBlurBackground();
    const [mic, setMic] = useState(useMic);
    const [cam, setCam] = useState(useCam);
    const enabled = useRef(false);

    useEffect(() => {
            if(!enabled.current && setStream) {
                streamLocal.current(setStream, mic, cam);
                enabled.current = true;
            }
    }, [stream, setStream, mic, cam, streamLocal]);

    useEffect(() => {
        if(enabled.current && setStream && (useMic !== mic || useCam !== cam)) {
            reset.current();
            streamLocal.current(setStream, useMic, useCam);
            setMic(useMic);
            setCam(useCam);
        }
}, [stream, setStream, mic, cam, useMic, useCam, streamLocal, reset]);

    return (
    <>
        <UserVideo stream={stream} username="you" muted/> 
        <video className="input-video" ref={videoRef} style={{ display: 'none',}}></video>
        <canvas className="output-canvas" style={{ display: 'none',}} ref={canvasRef}></canvas>
    </>
    );
};

export default CameraBlurBackground;