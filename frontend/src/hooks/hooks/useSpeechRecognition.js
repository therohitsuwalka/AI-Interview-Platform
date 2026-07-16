import { useEffect, useState, useRef } from "react";

export default function useSpeechRecognition() {

    const recognitionRef = useRef(null);

    const [transcript, setTranscript] = useState("");

    const [isListening, setIsListening] = useState(false);

    useEffect(() => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        const recognition =
            new SpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = true;

        recognition.lang = "en-US";

        recognition.onresult = (event) => {

            let text = "";

            for (let i = 0; i < event.results.length; i++) {

                text +=
                    event.results[i][0].transcript + " ";

            }

            setTranscript(text);

        };

        recognitionRef.current = recognition;

    }, []);

    const startListening = () => {

        if (!recognitionRef.current) return;

        setTranscript("");

        recognitionRef.current.start();

        setIsListening(true);

    };

    const stopListening = () => {

        if (!recognitionRef.current) return;

        recognitionRef.current.stop();

        setIsListening(false);

    };

    return {

        transcript,

        isListening,

        startListening,

        stopListening,

        setTranscript

    };

}

useSpeechRecognition