import { createContext, useContext, useState } from "react";

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {

    const [session, setSession] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [answers, setAnswers] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [timer, setTimer] =
        useState(0);

    const [confidence, setConfidence] =
        useState(0);

    const [transcript, setTranscript] =
        useState("");

    const [isInterviewCompleted,
        setInterviewCompleted] =
        useState(false);

    const [result,
        setResult] =
        useState(null);

    const [difficulty,
        setDifficulty] =
        useState("Medium");

    const [reviewQuestions,
        setReviewQuestions] =
        useState([]);

    const startInterview = (data) => {

        setSession(data);

        setQuestions(data.answers || []);

        setCurrentQuestion(0);

        setAnswers([]);

        setTimer(0);

        setConfidence(0);

        setTranscript("");

        setInterviewCompleted(false);

        setResult(null);

    };
        const saveCurrentAnswer = (answer) => {

        setAnswers((prev) => {

            const updated = [...prev];

            updated[currentQuestion] = answer;

            return updated;

        });

    };

    const nextQuestion = () => {

        if (currentQuestion < questions.length - 1) {

            setCurrentQuestion((prev) => prev + 1);

        } else {

            setInterviewCompleted(true);

        }

    };

    const previousQuestion = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion((prev) => prev - 1);

        }

    };

    const markForReview = (index) => {

        setReviewQuestions((prev) => {

            if (prev.includes(index))
                return prev;

            return [...prev, index];

        });

    };
        const skipQuestion = () => {

        setAnswers((prev) => {

            const updated = [...prev];

            updated[currentQuestion] = {

                skipped: true,

            };

            return updated;

        });

        nextQuestion();

    };

    const updateConfidence = (value) => {

        setConfidence(value);

    };

    const updateTranscript = (text) => {

        setTranscript(text);

    };

    const updateDifficulty = (level) => {

        setDifficulty(level);

    };

    const finishInterview = (data) => {

        setInterviewCompleted(true);

        setResult(data);

    };

    const resetInterview = () => {

        setSession(null);

        setQuestions([]);

        setCurrentQuestion(0);

        setAnswers([]);

        setTimer(0);

        setConfidence(0);

        setTranscript("");

        setInterviewCompleted(false);

        setResult(null);

        setDifficulty("Medium");

        setReviewQuestions([]);

    };
        const value = {

        session,

        questions,

        currentQuestion,

        answers,

        loading,

        timer,

        confidence,

        transcript,

        difficulty,

        reviewQuestions,

        result,

        isInterviewCompleted,

        setLoading,

        setTimer,

        setConfidence,

        setTranscript,

        startInterview,

        saveCurrentAnswer,

        nextQuestion,

        previousQuestion,

        skipQuestion,

        markForReview,

        updateConfidence,

        updateTranscript,

        updateDifficulty,

        finishInterview,

        resetInterview,

    };

    return (

        <InterviewContext.Provider value={value}>

            {children}

        </InterviewContext.Provider>

    );

};
export const useInterviewContext = () => {

    const context = useContext(InterviewContext);

    if (!context) {

        throw new Error(

            "useInterviewContext must be used inside InterviewProvider"

        );

    }

    return context;

};

export default InterviewContext;