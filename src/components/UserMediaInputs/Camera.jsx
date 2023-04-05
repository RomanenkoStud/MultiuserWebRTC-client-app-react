import { useEffect, useRef } from "react";
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

const endStream = (stream) => {
    console.log("stop", stream.id)
    stream.getTracks().forEach(function(track) {
        track.stop();
    });
}

const makeCancelable = (promise) => {
    let hasCanceled = false;
    
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) => {
            if(hasCanceled) {
                endStream(val);
                reject({ isCanceled: true })
            } else {
                resolve(val)
            } 
        }
        );
        promise.catch((error) =>
            hasCanceled ? reject({ isCanceled: true }) : reject(error)
        );
    });
    
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled = true;
        },
    };
};

const getEmptyStream = async () => {
    return new Promise((resolve) => {
        const dummyStream = new MediaStream();
        dummyStream.addTrack(audioMuted());
        dummyStream.addTrack(videoMuted());
        
        resolve(dummyStream);
    });
}

const getCameraStream = async (useMic, useCam) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: useMic,
            video: useCam ? userVideoSize : false,
        });
        !useMic && stream.addTrack(audioMuted());
        !useCam && stream.addTrack(videoMuted());
        return stream;
    } catch (error) {
        console.error("Stream not found: ", error);
        throw error;
    }
};

const streamLocal = (setStream, useMic, useCam, latestStreamValue, latestStreamPromise) => {
    const newStreamPromise = (useCam || useMic) ? getCameraStream(useMic, useCam) : getEmptyStream();
    
    if (latestStreamPromise.current) {
        latestStreamPromise.current.cancel();
    }
    
    latestStreamPromise.current = makeCancelable(newStreamPromise);
    
    latestStreamPromise.current.promise
        .then((stream) => {
            console.log("Local Stream found", stream.id, useCam, useMic);
            latestStreamValue = stream;
            setStream(stream);
        })
        .catch((error) => {
            console.error("Stream not found: ", error);
        });
};


const Camera = ({stream, setStream, useMic, useCam, latestStreamValue, latestStreamPromise}) => {
    const mic = useRef(useMic);
    const cam = useRef(useCam);
    const enabled = useRef(false);

    useEffect(() => {
            if(!enabled.current && setStream) {
                streamLocal(setStream, mic.current, cam.current, latestStreamValue, latestStreamPromise);
                enabled.current = true;
            }
    }, [setStream, latestStreamValue, latestStreamPromise]);

    useEffect(() => {
        if(enabled.current && setStream && (useMic !== mic.current || useCam !== cam.current)) {
            streamLocal(setStream, useMic, useCam, latestStreamValue, latestStreamPromise);
            mic.current = useMic;
            cam.current = useCam;
        }
    }, [setStream, useMic, useCam, latestStreamValue, latestStreamPromise]);

    return (
    <>
        <UserVideo stream={stream} username="you" muted/> 
    </>
    );
};

export default Camera;