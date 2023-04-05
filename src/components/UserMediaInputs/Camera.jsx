import { useState, useEffect, useRef } from "react";
import UserVideo from "../UserVideo";

const userVideoSize = { height: 300, width: 300, };

const audioMuted = () => {
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
    return audioTrack;
}

const videoMuted = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const videoStream = canvas.captureStream();
    const videoTrack = videoStream.getVideoTracks()[0];
    videoTrack.enabled = false;
    return videoTrack;
}

const streamLocal = (setStream, useMic, useCam) => {
    navigator.mediaDevices
        .getUserMedia({
            audio: useMic,
            video: useCam ? userVideoSize : false,
        })
        .then((stream) => {
            console.log("Local Stream found", useCam, useMic);
            !useMic && stream.addTrack(audioMuted());
            !useCam && stream.addTrack(videoMuted());
            setStream(stream);
        })
        .catch((error) => {
            console.error("Stream not found: ", error);
        });
};

const Camera = ({stream, setStream, useMic, useCam}) => {
    const [mic, setMic] = useState(useMic);
    const [cam, setCam] = useState(useCam);
    const enabled = useRef(false);

    useEffect(() => {
            if(!enabled.current && setStream) {
                streamLocal(setStream, mic, cam);
                enabled.current = true;
            }
    }, [stream, setStream, mic, cam]);

    useEffect(() => {
        if(enabled.current && setStream && (useMic !== mic || useCam !== cam)) {
            streamLocal(setStream, useMic, useCam);
            setMic(useMic);
            setCam(useCam);
        }
}, [stream, setStream, mic, cam, useMic, useCam]);

    return (
    <>
        <UserVideo stream={stream} username="you" muted/> 
    </>
    );
};

export default Camera;