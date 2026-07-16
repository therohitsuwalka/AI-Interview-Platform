import { useEffect, useState, useRef, useCallback } from "react";

export default function useSpeechRecognition() {
  const recognitionRef = useRef(null);
  const shouldBeListeningRef = useRef(false);

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }

      setTranscript(text.trim());
    };

    recognition.onerror = (event) => {
      // "no-speech" fires often when the mic is just silent for a bit -
      // not a real error, so don't surface it to the user.
      if (event.error === "no-speech") return;

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone access was denied. Please allow mic permission and try again.");
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }

      shouldBeListeningRef.current = false;
      setIsListening(false);
    };

    // Chrome auto-stops recognition after a period of silence even in
    // "continuous" mode. If the user hasn't clicked stop, restart it so
    // the mic keeps listening for as long as they intended.
    recognition.onend = () => {
      if (shouldBeListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          shouldBeListeningRef.current = false;
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldBeListeningRef.current = false;
      try {
        recognition.stop();
      } catch {
        // already stopped, ignore
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setError("");
    setTranscript("");
    shouldBeListeningRef.current = true;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // Most common cause: start() called while it's already running.
      // Reset and try once more on a clean instance state.
      if (err?.name === "InvalidStateError") {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        setIsListening(true);
      } else {
        setError("Could not start microphone. Please check permissions.");
        shouldBeListeningRef.current = false;
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    shouldBeListeningRef.current = false;

    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }

    setIsListening(false);
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    setTranscript,
  };
}
