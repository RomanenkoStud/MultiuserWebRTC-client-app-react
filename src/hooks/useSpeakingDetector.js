import { useState, useEffect } from 'react';

export const useSpeakingDetector = (stream) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!stream) return; // null check

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      analyser.getByteTimeDomainData(dataArray);
      let max = 0;
      for (let i = 0; i < bufferLength; i++) {
        const value = Math.abs(dataArray[i] - 128);
        if (value > max) {
          max = value;
        }
      }
      setIsSpeaking(max > 5); // adjust threshold as needed
      requestAnimationFrame(update);
    };

    update();

    return () => {
      source.disconnect(analyser);
    };
  }, [stream]);

  return isSpeaking;
};