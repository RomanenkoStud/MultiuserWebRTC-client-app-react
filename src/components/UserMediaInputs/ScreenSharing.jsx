import { useState, useEffect } from "react";
import VideoItem from "../VideoItem";

const deskVideoSize = { height: 720, width: 1280, };

const streamDesk = (setStream) => {
    navigator.mediaDevices
        .getDisplayMedia({
        frameRate: { 
            ideal: 8, 
            max: 10 },
        audio: true,
        video: deskVideoSize,
    })
    .then((stream) => {
        console.log("Desk Stream found");
        setStream(stream);
    })
    .catch((error) => {
        console.error("Stream not found: ", error);
    });
}

const ScreenSharing = ({setStream}) => {
    const [deskStream, setDeskStream] = useState(null);

    useEffect(() => {
        streamDesk(setDeskStream);
    }, []);

    useEffect(() => {
        if(deskStream){
            setStream(deskStream);
        }
    }, [deskStream]);

    return (
    <>
        <VideoItem stream={deskStream} muted/> 
    </>
    );
};

export default ScreenSharing;