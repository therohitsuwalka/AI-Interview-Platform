import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  startAdaptiveInterview,
  submitAdaptiveAnswer,
  finishAdaptiveInterview,
} from "../../services/adaptiveInterviewService";
import { downloadAdaptiveReportPDF } from "../../services/reportService";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import { Mic, MicOff, Send, Flag, Loader2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

const DIFFICULTY_STYLES = {
  Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const DECISION_LABEL = {
  easy_follow_up: "Easier follow-up (answer needed more depth)",
  hard_follow_up: "Harder follow-up (great answer!)",
  cross_question: "Cross-question (digging deeper)",
  next_topic: "Moving to a new topic",
};

function AdaptiveInterview() {
  const navigate = useNavigate();

  const interviewData = JSON.parse(localStorage.getItem("interviewData")) || {};
  const resumeAnalysisId = interviewData.analysisId || null;

  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState(interviewData.difficulty || "Medium");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(8);
  const [starting, setStarting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [error, setError] = useState("");

  const { transcript, isListening, startListening, stopListening, setTranscript } =
    useSpeechRecognition();

  // Keep the textarea in sync with live speech transcript
  useEffect(() => {
    if (isListening) {
      setAnswer(transcript);
    }
  }, [transcript, isListening]);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      setTranscript(answer ? answer + " " : "");
      startListening();
    }
  };

  // Start the interview session on mount
  useEffect(() => {
    const init = async () => {
      try {
        setStarting(true);

        const res = await startAdaptiveInterview({
          role: interviewData.role,
          company: interviewData.company,
          experience: interviewData.experience,
          difficulty: interviewData.difficulty || "Medium",
          analysisId: resumeAnalysisId,
        });

        setSessionId(res.data.sessionId);
        setQuestion(res.data.question);
        setDifficulty(res.data.difficulty);
        setQuestionNumber(res.data.questionNumber);
        setTotalQuestions(res.data.totalQuestions);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Unable to start adaptive interview. Please go back and try again."
        );
      } finally {
        setStarting(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (isListening) stopListening();

    if (!sessionId) return;

    try {
      setSubmitting(true);
      setLastEvaluation(null);

      const res = await submitAdaptiveAnswer({
        sessionId,
        question,
        answer,
      });

      setLastEvaluation({
        ...res.data.evaluation,
        decision: res.data.decision,
        topic: res.data.topic,
      });

      if (res.data.evaluation?.verdict === "strong") {
        toast.success(DECISION_LABEL[res.data.decision] || "Great answer!");
      } else if (res.data.evaluation?.verdict === "weak") {
        toast(DECISION_LABEL[res.data.decision] || "Let's try an easier one", {
          icon: "💡",
        });
      } else {
        toast(DECISION_LABEL[res.data.decision] || "Next question");
      }

      if (res.data.isComplete) {
        setIsComplete(true);
        setFinalScore(res.data.overallScore);
      } else {
        setQuestion(res.data.nextQuestion);
        setDifficulty(res.data.difficulty);
        setQuestionNumber(res.data.questionNumber);
        setAnswer("");
        setTranscript("");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishEarly = async () => {
    if (!sessionId) return;

    try {
      setSubmitting(true);
      const res = await finishAdaptiveInterview({ sessionId });
      setIsComplete(true);
      setFinalScore(res.data.session.overallScore);
    } catch (err) {
      console.error(err);
      toast.error("Failed to finish interview.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-rose-400 font-semibold mb-6">{error}</p>
          <button
            onClick={() => navigate("/interview-setup")}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  if (starting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-400" size={40} />
        <p className="text-slate-300 font-medium">Starting your adaptive interview...</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-10 text-center">
          <h1 className="text-3xl font-black text-white mb-2">Interview Complete 🎉</h1>
          <p className="text-slate-400 mb-8">
            You answered {questionNumber} question{questionNumber > 1 ? "s" : ""} with adaptive difficulty.
          </p>

          <div className="mx-auto w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex flex-col items-center justify-center mb-8">
            <span className="text-xs text-white/80 font-semibold uppercase">Overall Score</span>
            <span className="text-4xl font-black text-white">{finalScore ?? "--"}%</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={async () => {
                try {
                  await downloadAdaptiveReportPDF(sessionId);
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to download PDF report.");
                }
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              📄 Download PDF Report
            </button>

            <button
              onClick={() => navigate("/history")}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              View History
            </button>
            <button
              onClick={() => navigate("/interview-setup")}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              Start Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-black flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Progress + difficulty */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-400">
              Question {questionNumber} / {totalQuestions}
            </span>
            <div className="w-40 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.Medium}`}
          >
            {difficulty} Difficulty
          </span>
        </div>

        {/* Last evaluation feedback banner */}
        {lastEvaluation && (
          <div
            className={`mb-6 rounded-2xl border p-4 flex items-start gap-3 ${
              lastEvaluation.verdict === "strong"
                ? "border-emerald-500/20 bg-emerald-500/5"
                : lastEvaluation.verdict === "weak"
                ? "border-rose-500/20 bg-rose-500/5"
                : "border-slate-700 bg-slate-900/40"
            }`}
          >
            {lastEvaluation.verdict === "strong" ? (
              <TrendingUp className="text-emerald-400 shrink-0 mt-0.5" size={18} />
            ) : lastEvaluation.verdict === "weak" ? (
              <TrendingDown className="text-rose-400 shrink-0 mt-0.5" size={18} />
            ) : (
              <ArrowRight className="text-slate-400 shrink-0 mt-0.5" size={18} />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Previous answer score: {lastEvaluation.score}/100 — {lastEvaluation.verdict}
              </p>
              <p className="text-xs text-slate-400 mt-1">{lastEvaluation.feedback}</p>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
            {question}
          </h1>

          <div className="mt-8 relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-5 pr-16 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none placeholder-slate-600"
              rows={7}
              placeholder="Type your answer, or click the mic and speak..."
            />

            <button
              type="button"
              onClick={toggleMic}
              title={isListening ? "Stop recording" : "Start recording"}
              className={`absolute right-4 bottom-4 w-11 h-11 rounded-full flex items-center justify-center transition ${
                isListening
                  ? "bg-rose-600 animate-pulse text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>

          {isListening && (
            <p className="mt-2 text-xs text-rose-400 font-medium animate-pulse">
              🎙️ Listening... speak now, your words will appear above.
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleFinishEarly}
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-slate-300 hover:bg-white/10 transition disabled:opacity-50"
            >
              <Flag size={16} />
              Finish Interview
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Analyzing Answer...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit & Next Question
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaptiveInterview;
