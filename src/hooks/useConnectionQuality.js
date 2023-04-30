import { useState, useEffect } from 'react';

export const useConnectionQuality = (peerConnection) => {
    const [rating, setRating] = useState(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
        peerConnection.getStats().then(stats => {
            // Find the last stats object
            let lastResult;
            stats.forEach(report => {
            if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                lastResult = report;
            }
            });

            // Calculate the round trip time (RTT) and convert it to a rating
            const rtt = lastResult.currentRoundTripTime * 1000; // convert to milliseconds
            const rating = Math.max(1, Math.min(5, Math.round(10 - rtt / 100)));

            // Set the rating
            setRating(rating);
        });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [peerConnection]);

    return rating;
};