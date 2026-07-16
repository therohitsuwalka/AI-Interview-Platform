import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import InterviewHeader from "../../components/Interview/InterviewHeader";
import QuestionCard from "../../components/Interview/QuestionCard";
import WebcamPanel from "../../components/Interview/WebcamPanel";
import InterviewControls from "../../components/Interview/InterviewControls";
import TranscriptPanel from "../../components/Interview/TranscriptPanel";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

function Interview() {

    const navigate = useNavigate();

    const webcamRef = useRef(null);

    const interviewData = JSON.parse(

        localStorage.getItem("interviewData")

    ) || {};

    const storedQuestions = JSON.parse(

        localStorage.getItem("questions")

    ) || [];

    const questions = Array.isArray(storedQuestions)

        ? storedQuestions

        : String(storedQuestions)

            .split("\n")

            .filter((q) => q.trim() !== "");

    const [currentQuestion, setCurrentQuestion] = useState(

        Number(localStorage.getItem("currentQuestion")) || 0

    );

    const [transcript, setTranscript] = useState(

        localStorage.getItem("draftAnswer") || ""

    );

    const [answers, setAnswers] = useState(

        JSON.parse(

            localStorage.getItem("interviewAnswers")

        ) || []

    );

    const {
        transcript: liveTranscript,
        isListening,
        isSupported,
        error: speechError,
        startListening,
        stopListening,
        setTranscript: setLiveTranscript,
    } = useSpeechRecognition();

    // Keep the draft answer in sync with live speech while the mic is on
    useEffect(() => {
        if (isListening) {
            setTranscript(liveTranscript);
        }
    }, [liveTranscript, isListening]);

    // Warn once if this browser doesn't support voice input
    useEffect(() => {
        if (!isSupported) {
            toast.error(
                "Speech recognition isn't supported in this browser. Try Chrome, or type your answer manually."
            );
        }
    }, [isSupported]);

    // Surface any mic/permission errors instead of failing silently
    useEffect(() => {
        if (speechError) {
            toast.error(speechError);
        }
    }, [speechError]);

    const [timeLeft, setTimeLeft] = useState(

        Number(localStorage.getItem("timeLeft")) ||

        15 * 60

    );

        const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    // -----------------------------
    // Timer
    // -----------------------------

    useEffect(() => {

        const timer = setInterval(() => {

            setTimeLeft((prev) => {

                const next = prev - 1;

                localStorage.setItem(

                    "timeLeft",

                    next

                );

                if (next <= 0) {

                    clearInterval(timer);

                    navigate("/result");

                    return 0;

                }

                return next;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [navigate]);

    // -----------------------------
    // Auto Save Draft
    // -----------------------------

    useEffect(() => {

        localStorage.setItem(

            "draftAnswer",

            transcript

        );

    }, [transcript]);
        // -----------------------------
    // Start / Stop Microphone
    // -----------------------------

    const handleMic = () => {

        if (isListening) {

            stopListening();

        } else {

            // Prime the recognizer with whatever text is already there
            // (typed manually or from a previous listening session) so
            // resuming the mic doesn't wipe out existing answer text.
            setLiveTranscript(transcript ? transcript + " " : "");

            startListening();

        }

    };

    // -----------------------------
    // Save Current Answer
    // -----------------------------

    const saveCurrentAnswer = () => {

        const updatedAnswers = [...answers];

        updatedAnswers[currentQuestion] = {

            question: questions[currentQuestion],

            answer: transcript,

        };

        setAnswers(updatedAnswers);

        localStorage.setItem(

            "interviewAnswers",

            JSON.stringify(updatedAnswers)

        );

    };

    // -----------------------------
    // Previous Question
    // -----------------------------

    const previousQuestion = () => {

        saveCurrentAnswer();

        if (currentQuestion === 0) return;

        const previous = currentQuestion - 1;

        setCurrentQuestion(previous);

        localStorage.setItem(

            "currentQuestion",

            previous

        );

        setTranscript(

            answers[previous]?.answer || ""

        );

    };

    // -----------------------------
    // Next Question
    // -----------------------------

    const nextQuestion = () => {

        saveCurrentAnswer();

        if (

            isListening

        ) {

            stopListening();

        }

        if (

            currentQuestion <

            questions.length - 1

        ) {

            const next = currentQuestion + 1;

            setCurrentQuestion(next);

            localStorage.setItem(

                "currentQuestion",

                next

            );

            setTranscript(

                answers[next]?.answer || ""

            );

        }

        else {

            localStorage.removeItem(

                "draftAnswer"

            );

            localStorage.removeItem(

                "currentQuestion"

            );

            localStorage.removeItem(

                "timeLeft"

            );

            navigate("/result");

        }

    };

    // -----------------------------
    // Skip Question
    // -----------------------------

    const skipQuestion = () => {

        setTranscript("");

        nextQuestion();

    };
        return (

        <div className="min-h-screen bg-slate-100">

            <InterviewHeader

                minutes={minutes}

                seconds={seconds}

            />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 p-8">

                {/* Left Panel */}

                <QuestionCard

                    question={questions[currentQuestion]}

                    currentQuestion={currentQuestion}

                    totalQuestions={questions.length}

                    nextQuestion={nextQuestion}

                />

                {/* Right Panel */}

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <WebcamPanel

                        webcamRef={webcamRef}

                    />

                    <InterviewControls

                        isListening={isListening}

                        handleMic={handleMic}

                    />

                    <TranscriptPanel

                        transcript={transcript}

                    />

                    <div className="grid grid-cols-2 gap-4 mt-8">

                        <button

                            onClick={previousQuestion}

                            disabled={currentQuestion === 0}

                            className="rounded-xl border border-slate-300 py-4 font-semibold hover:bg-slate-100 disabled:opacity-50"

                        >

                            ← Previous

                        </button>

                        <button

                            onClick={skipQuestion}

                            className="rounded-xl bg-yellow-500 py-4 font-semibold text-white hover:bg-yellow-600"

                        >

                            Skip →

                        </button>

                    </div>

                    <div className="mt-6 rounded-2xl bg-slate-100 p-5">

                        <h3 className="text-lg font-bold">

                            Interview Details

                        </h3>

                        <div className="mt-4 space-y-2 text-gray-700">

                            <p>

                                <strong>Role:</strong>{" "}

                                {interviewData.role}

                            </p>

                            <p>

                                <strong>Company:</strong>{" "}

                                {interviewData.company}

                            </p>

                            <p>

                                <strong>Experience:</strong>{" "}

                                {interviewData.experience}

                            </p>

                            <p>

                                <strong>Difficulty:</strong>{" "}

                                {interviewData.difficulty}

                            </p>

                            <p>

                                <strong>Total Questions:</strong>{" "}

                                {questions.length}

                            </p>

                        </div>

                    </div>

                </div>

            </div>
                        {/* Bottom Status */}

            <div className="max-w-7xl mx-auto px-8 pb-8">

                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-6">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                        <div>

                            <h3 className="text-xl font-bold">

                                AI Interview Status

                            </h3>

                            <p className="text-gray-600 mt-2">

                                {
                                    isListening
                                        ? "🎤 Listening... Your answer is being captured in real time."
                                        : "⏸ Microphone is paused. Click the mic button to continue."
                                }

                            </p>

                        </div>

                        <div className="text-right">

                            <p className="text-sm text-gray-500">

                                Progress

                            </p>

                            <p className="text-3xl font-bold text-blue-600">

                                {currentQuestion + 1} / {questions.length}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

           
                    </div>

    );

}

export default Interview;