import { useCallback } from "react";
import axios from "axios";

import { useInterviewContext } from "../context/InterviewContext";

const API =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/interview";

const useInterview = () => {

    const {

        session,

        currentQuestion,

        questions,

        answers,

        confidence,

        transcript,

        timer,

        startInterview,

        saveCurrentAnswer,

        nextQuestion,

        finishInterview,

        setLoading,

    } = useInterviewContext();

    const token = localStorage.getItem("token");

    const config = {

        headers: {

            Authorization: `Bearer ${token}`,

        },

    };
        /**
     * Create Interview Session
     */

    const createSession =
        useCallback(async (payload) => {

            try {

                setLoading(true);

                const { data } =
                    await axios.post(

                        `${API}/session`,

                        payload,

                        config

                    );

                startInterview(data.data);

                return data;

            } catch (error) {

                console.error(error);

                throw error;

            } finally {

                setLoading(false);

            }

        }, []);

    /**
     * Get Session
     */

    const loadSession =
        useCallback(async (sessionId) => {

            try {

                setLoading(true);

                const { data } =
                    await axios.get(

                        `${API}/session/${sessionId}`,

                        config

                    );

                startInterview(data.data);

                return data;

            } finally {

                setLoading(false);

            }

        }, []);
            /**
     * Save Answer (Auto Save)
     */

    const submitAnswer =
        useCallback(async (answer) => {

            try {

                saveCurrentAnswer(answer);

                const payload = {

                    answer,

                    confidence,

                    transcript,

                    duration: timer,

                };

                const { data } =
                    await axios.put(

                        `${API}/session/${session._id}/answer`,

                        payload,

                        config

                    );

                nextQuestion();

                return data;

            } catch (error) {

                console.error(error);

                throw error;

            }

        }, [
            session,
            confidence,
            transcript,
            timer,
        ]);

    /**
     * Skip Question
     */

    const skipCurrentQuestion =
        useCallback(async () => {

            try {

                await axios.put(

                    `${API}/session/${session._id}/skip`,

                    {},

                    config

                );

                nextQuestion();

            } catch (error) {

                console.error(error);

            }

        }, [session]);
            /**
     * Mark Question For Review
     */

    const reviewQuestion =
        useCallback(async () => {

            try {

                await axios.put(

                    `${API}/session/${session._id}/review`,

                    {},

                    config

                );

            } catch (error) {

                console.error(error);

            }

        }, [session]);

    /**
     * Recover Previous Session
     */

    const recoverSession =
        useCallback(async () => {

            try {

                const id =
                    localStorage.getItem(
                        "interviewSession"
                    );

                if (!id) return;

                await loadSession(id);

            } catch (error) {

                console.error(error);

            }

        }, []);

    /**
     * Store Session
     */

    const cacheSession = (id) => {

        localStorage.setItem(
            "interviewSession",
            id
        );

    };
        /**
     * Complete Interview
     */

    const completeInterview =
        useCallback(async () => {

            try {

                const { data } =
                    await axios.put(

                        `${API}/session/${session._id}/complete`,

                        {},

                        config

                    );

                finishInterview(data.result);

                localStorage.removeItem(
                    "interviewSession"
                );

                return data;

            } catch (error) {

                console.error(error);

                throw error;

            }

        }, [session]);

    /**
     * Interview Analytics
     */

    const getAnalytics =
        useCallback(async () => {

            try {

                const { data } =
                    await axios.get(

                        `${API}/analytics`,

                        config

                    );

                return data.analytics;

            } catch (error) {

                console.error(error);

                return null;

            }

        }, []);

    /**
     * Clear Cached Session
     */

    const clearSession = () => {

        localStorage.removeItem(
            "interviewSession"
        );

    };

    return {

        session,

        questions,

        answers,

        currentQuestion,

        createSession,

        loadSession,

        recoverSession,

        cacheSession,

        submitAnswer,

        skipCurrentQuestion,

        reviewQuestion,

        completeInterview,

        getAnalytics,

        clearSession,

    };

};

export default useInterview;