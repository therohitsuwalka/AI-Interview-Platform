import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { evaluateInterview } from "../../services/interviewService";
import { downloadInterviewReport } from "../../utils/pdfGenerator";

function Result() {
  const interviewData = JSON.parse(localStorage.getItem("interviewData")) || {};

  const answers = JSON.parse(localStorage.getItem("interviewAnswers")) || [];

  const [loading, setLoading] = useState(true);

  const [evaluation, setEvaluation] = useState(null);

  const [error, setError] = useState("");

  const hasEvaluated = useRef(false);

 useEffect(() => {


   if (hasEvaluated.current) return;

    hasEvaluated.current = true;

  console.log("========== RESULT PAGE ==========");
  console.log("Answers:", answers);
  console.log("Interview Data:", interviewData);

  const evaluate = async () => {

    console.log("Calling Backend API...");

    try {

      const res = await evaluateInterview({
        answers,
        interviewData,
      });

      console.log("Backend Response:", res.data);

      setEvaluation(res.data.evaluation);

    } catch (err) {

      console.error("API ERROR:", err);
      console.error("Response:", err.response?.data);

      setError("Failed to evaluate interview.");

    } finally {

      setLoading(false);

    }

  };

  evaluate();

}, []);

  // --------------------------------------
  // Loading State
  // --------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="h-16 w-16 mx-auto rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

          <h2 className="mt-8 text-3xl font-bold">
            AI is Evaluating Your Interview
          </h2>

          <p className="mt-3 text-gray-500">
            Please wait while Gemini analyzes your answers...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------
  // Error State
  // --------------------------------------

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-xl">
          <h2 className="text-4xl font-bold text-red-600">Evaluation Failed</h2>

          <p className="mt-5 text-gray-600">{error}</p>

          <Link
            to="/dashboard"
            className="inline-block mt-8 rounded-xl bg-blue-600 px-8 py-4 text-white hover:bg-blue-700"
          >
            Back To Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------
  // AI Evaluation Data
  // --------------------------------------

  const {
    overallScore,

    technical,

    communication,

    confidence,

    grammar,

    recommendation,

    feedback,

    strengths = [],

    weaknesses = [],

    improvements = [],
  } = evaluation;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-10">
        <h1 className="text-5xl font-bold text-center">
          🎉 Interview Completed
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Your interview has been successfully completed.
        </p>

        <div className="flex justify-center mt-10">
          <div className="w-56 h-56 rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 text-white flex flex-col justify-center items-center shadow-2xl">
            <p className="text-lg opacity-90">Overall Score</p>

            <h1 className="text-6xl font-bold">{overallScore}%</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-slate-100 rounded-2xl p-6">
            <h3 className="font-bold text-lg">Communication</h3>

            <p className="text-5xl mt-4 text-blue-600">{communication}/100</p>
          </div>

          <div className="bg-slate-100 rounded-2xl p-6">
            <h3 className="font-bold text-lg">Technical</h3>

            <p className="text-5xl mt-4 text-green-600">{technical}/100</p>
          </div>

          <div className="bg-slate-100 rounded-2xl p-6">
            <h3 className="font-bold text-lg">Confidence</h3>

            <p className="text-5xl mt-4 text-purple-600">{confidence}/100</p>
          </div>

          <div className="bg-slate-100 rounded-2xl p-6">
            <h3 className="font-bold text-lg">Grammar</h3>

            <p className="text-5xl mt-4 text-orange-600">{grammar}/100</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold">🤖 AI Interview Report</h2>

          <p className="mt-6 leading-8 text-gray-300">{feedback}</p>

          <div className="grid lg:grid-cols-3 gap-6 mt-10">
            <div className="rounded-2xl bg-white/10 p-6">
              <h3 className="text-xl font-bold text-green-400">💪 Strengths</h3>

              <ul className="mt-4 space-y-3">
                {strengths.map((item, index) => (
                  <li key={index}>✅ {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/10 p-6">
              <h3 className="text-xl font-bold text-yellow-400">
                ⚠️ Weaknesses
              </h3>

              <ul className="mt-4 space-y-3">
                {weaknesses.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/10 p-6">
              <h3 className="text-xl font-bold text-cyan-400">
                🚀 Improvements
              </h3>

              <ul className="mt-4 space-y-3">
                {improvements.map((item, index) => (
                  <li key={index}>➜ {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-blue-600 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Hiring Recommendation</h2>

              <p className="mt-2 text-blue-100">
                AI Decision based on your complete interview performance.
              </p>
            </div>

            <div className="text-3xl font-bold">{recommendation}</div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5 mt-12">
          <button
            onClick={() => {
              localStorage.removeItem("questions");

              localStorage.removeItem("interviewAnswers");

              localStorage.removeItem("draftAnswer");

              localStorage.removeItem("currentQuestion");

              localStorage.removeItem("timeLeft");

              localStorage.removeItem("finalTranscript");

              localStorage.removeItem("interviewData");

              window.location.href = "/resume-upload";
            }}
            className="rounded-xl bg-green-600 px-8 py-4 text-white font-semibold hover:bg-green-700 transition"
          >
            🔄 Retake Interview
          </button>

          <button
  onClick={() =>
    downloadInterviewReport(
      evaluation,
      interviewData
    )
  }
  className="rounded-xl bg-slate-700 px-8 py-4 text-white font-semibold hover:bg-slate-800 transition"
>
  📄 Download PDF Report
</button>

          <Link
            to="/dashboard"
            className="rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 transition"
          >
            🏠 Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Result;
