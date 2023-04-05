import { useEffect, useRef } from "react";
import UserVideo from "../UserVideo";

const streamLocal = (setStream) => {
    // Create dummy audio track
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    oscillator.connect(gainNode);
    const dest = audioContext.createMediaStreamDestination();
    gainNode.connect(dest);
    oscillator.start();
    const audioTrack = dest.stream.getAudioTracks()[0];
    audioTrack.enabled = false;

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const videoStream = canvas.captureStream();
    const videoTrack = videoStream.getVideoTracks()[0];
    videoTrack.enabled = false;

    const dummyStream = new MediaStream();
    dummyStream.addTrack(audioTrack);
    dummyStream.addTrack(videoTrack);
    
    setTimeout(() => {
        console.log("Empty Stream");
        setStream(dummyStream);
    }, 2000); 
};

const CameraOff = ({stream, setStream}) => {
    const enabled = useRef(false);
    useEffect(() => {
            if(!enabled.current && setStream) {
                streamLocal(setStream);
                enabled.current = true;
            }
    }, [stream, setStream]);

    return (
    <>
        <UserVideo stream={stream} username="you" muted/> 
    </>
    );
};

export default CameraOff;