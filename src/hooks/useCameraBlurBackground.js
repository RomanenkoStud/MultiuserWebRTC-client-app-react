import { useEffect, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";


export const useCameraBlurBackground = (videoRef, canvasRef) => {
    const [stream, setStream] = useState();
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

        const camera = new Camera(videoElement, {
            onFrame: async () => {
            await selfieSegmentation.send({image: videoElement});
            },
            aspectRatio: 1,
        });

        camera.start();
        
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const audio = stream.getAudioTracks()[0];
            const videoBlured = canvasElement.captureStream().getVideoTracks()[0];
            setStream(new MediaStream([audio, videoBlured]));
        });

        return () => {
            camera.stop();
            selfieSegmentation.reset();
        }
    }, []);
    return stream;
};
