import { useState, useEffect, useRef } from "react";
import UserVideo from "../UserVideo/UserVideo";

const userVideoSize = { height: 300, width: 300, };

const streamLocal = (setStream) => {
    navigator.mediaDevices
        .getUserMedia({
            frameRate: { 
                ideal: 8, 
                max: 10 },
            audio: true,
            video: userVideoSize,
        })
        .then((stream) => {
            console.log("Local Stream found");
            setStream(stream);
        })
        .catch((error) => {
            console.error("Stream not found: ", error);
        });
};

const Camera = ({stream, setStream}) => {
    const [cameraStream, setCameraStream] = useState(null);
    const enabled = useRef(false);
    useEffect(() => {
        if(stream) {
            setCameraStream(stream);
        } else {
            if(!enabled.current) {
                streamLocal(setCameraStream);
                enabled.current = true;
            }
        }
    }, [stream]);

    useEffect(() => {
        if(cameraStream && !stream){
            setStream(cameraStream);
        }
    }, [cameraStream, stream, setStream]);

    return (
    <>
        <UserVideo stream={cameraStream} username="you" muted/> 
    </>
    );
};

export default Camera;