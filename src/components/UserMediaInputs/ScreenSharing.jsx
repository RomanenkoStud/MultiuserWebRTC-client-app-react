import { useState, useEffect, useRef } from "react";
import DeskVideo from "../DeskVideo";

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
    const enabled = useRef(false);

    useEffect(() => {
        if(!enabled.current){
            streamDesk(setDeskStream, onCancel);
            enabled.current = true;
        }
    }, [onCancel]);

    useEffect(() => {
        if(deskStream && setStream){
            setStream(deskStream);
        }
    }, [deskStream, setStream]);

    return (
    <>
        {deskStream ? <DeskVideo stream={deskStream} username="you" muted/> : null} 
    </>
    );
};

export default ScreenSharing;