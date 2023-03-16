import { useState, useEffect } from "react";
import VideoItem from "../VideoItem";

const deskVideoSize = { height: 720, width: 1280, };

const streamDesk = (setStream, onCancel) => {
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
        onCancel();
    });
}

const ScreenSharing = ({setStream, onCancel}) => {
    const [deskStream, setDeskStream] = useState(null);

    useEffect(() => {
        streamDesk(setDeskStream, onCancel);
    }, []);

    useEffect(() => {
        if(deskStream){
            setStream(deskStream);
        }
    }, [deskStream]);

    return (
    <>
        {deskStream ? <VideoItem stream={deskStream} muted/> : null} 
    </>
    );
};

export default ScreenSharing;