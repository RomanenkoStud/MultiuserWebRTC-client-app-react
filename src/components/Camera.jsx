import { useState, useEffect } from "react";
import UserVideo from "./UserVideo";

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

const Camera = ({setStream}) => {
    const [cameraStream, setCameraStream] = useState(null);

    useEffect(() => {
        streamLocal(setCameraStream);
    }, []);

    useEffect(() => {
        if(cameraStream){
            setStream(cameraStream);
        }
    }, [cameraStream]);

    return (
    <>
        <UserVideo stream={cameraStream} username="you" muted/> 
    </>
    );
};

export default Camera;