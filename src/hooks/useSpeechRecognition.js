import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechRecognition = (options = {}) => {
    const { lang = 'ja-JP', interimResults = true, continuous = false } = options;
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech Recognition API not supported in this browser.');
            return;
        }

        const reco = new SpeechRecognition();
        reco.lang = lang;
        reco.interimResults = interimResults;
        reco.continuous = continuous;

        reco.onstart = () => setIsListening(true);
        reco.onend = () => setIsListening(false);
        reco.onerror = (event) => setError(event.error);
        reco.onresult = (event) => {
            const current = event.resultIndex;
            const result = event.results[current];
            const text = result[0].transcript;
            setTranscript(text);
        };

        recognitionRef.current = reco;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [lang, interimResults, continuous]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setError(null);
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error('Speech recognition start error:', err);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        hasSupport: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    };
};

export default useSpeechRecognition;
