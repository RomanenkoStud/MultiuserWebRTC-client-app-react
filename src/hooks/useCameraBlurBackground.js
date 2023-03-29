import { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

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

export const useCameraBlurBackground = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamLocal = useRef();
    const reset = useRef();
    useEffect(() => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        function onResults(results) {
            // Save the context's blank state
            canvasCtx.save();

            // Draw the raw frame
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            // Make all pixels not in the segmentation mask transparent
            canvasCtx.globalCompositeOperation = 'destination-atop';
            canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

            // Blur the context for all subsequent draws then set the raw image as the background
            canvasCtx.filter = 'blur(16px)';
            canvasCtx.globalCompositeOperation = 'destination-over';
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            // Restore the context's blank state
            canvasCtx.restore();
        }

        const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
        }});
        selfieSegmentation.setOptions({
            modelSelection: 1,
        });
        selfieSegmentation.onResults(onResults);

        streamLocal.current = (setCameraStream, mic, cam) => {
            const camera = new Camera(videoElement, {
                onFrame: async () => {
                await selfieSegmentation.send({image: videoElement});
                },
                aspectRatio: 1,
            });
            if(mic)
            {
                if(cam) camera.start();
                navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const audio = stream.getAudioTracks()[0];
                    const videoBlured = cam ? 
                        canvasElement.captureStream().getVideoTracks()[0] : videoMuted();
                    setCameraStream(new MediaStream([audio, videoBlured]));
                });
            } else {
                camera.start();
                const audio = audioMuted();
                const videoBlured = canvasElement.captureStream().getVideoTracks()[0];
                setCameraStream(new MediaStream([audio, videoBlured]));
            }
            reset.current = () => {
                camera.stop();
            }
        }

        return () => {
            reset.current();
            selfieSegmentation.reset();
        }
    }, []);
    return {videoRef, canvasRef, streamLocal, reset};
};