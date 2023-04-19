import { useEffect, useRef } from 'react';

export const useSpeechRecognition = (isListening, lang, onResult) => {
    const transcript = useRef('');
    const recognition = useRef(null);

    useEffect(() => {
        console.log("recognition");
        recognition.current = new window.webkitSpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = lang;//'uk-UA' 'en-US'
        recognition.current.onresult = (event) => {
            const interimTranscript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join('');
                console.log(interimTranscript);
            transcript.current = interimTranscript;
        };
        recognition.current.onerror = (event) => {
            console.error(event.error);
        };

        if (isListening) {
            recognition.current.start();
        } else {
            onResult(transcript.current);
            recognition.current.abort();
        }

        return () => {
            recognition.current.abort(); // abort the recognition and free the microphone when unmounting the component
            console.log("recognition stop");
        }

    }, [isListening, lang, onResult]);
};