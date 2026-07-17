import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getInterviewById } from "../../services/interviewService";
import { downloadInterviewReportPDF } from "../../services/reportService";
import { ArrowLeft, Download, Loader2 } from "lucide-react";

const scoreColor = (score) => {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-rose-400";
};

function ScoreCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-black mt-1 ${scoreColor(value || 0)}`}>{value ?? 0}%</p>
    </div>
  );
}

function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getInterviewById(id);
        setInterview(res.data.interview);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Unable to load this interview. It may not exist."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadInterviewReportPDF(id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF report.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-400" size={40} />
        <p className="text-slate-300 font-medium">Loading interview details...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-rose-400 font-semibold mb-6">{error || "Interview not found."}</p>
          <Link
            to="/history"
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold inline-block"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back to History
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 font-semibold text-white transition disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Download size={16} />
            )}
            Download PDF
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">
            {interview.role || "Interview"}{" "}
            {interview.company && (
              <span className="text-slate-400 font-medium">@ {interview.company}</span>
            )}
          </h1>
          <p className="text-slate-500 mt-1">
            {interview.experience && `${interview.experience} • `}
            {interview.difficulty && `${interview.difficulty} Difficulty • `}
            {new Date(interview.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <ScoreCard label="Overall" value={interview.overallScore} />
          <ScoreCard label="Technical" value={interview.technical} />
          <ScoreCard label="Communication" value={interview.communication} />
          <ScoreCard label="Confidence" value={interview.confidence} />
          <ScoreCard label="Grammar" value={interview.grammar} />
        </div>

        {interview.feedback && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-bold text-white mb-2">Overall Feedback</h2>
            <p className="text-slate-300 leading-relaxed">{interview.feedback}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-white mb-4">Question-by-Question Breakdown</h2>

          <div className="space-y-4">
            {(interview.answers || []).map((qa, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-bold text-slate-200 mb-2">
                  Q{i + 1}. {qa.question}
                </p>
                <p className="text-slate-400 text-sm">
                  {qa.answer?.trim() ? qa.answer : (
                    <span className="italic text-slate-600">No answer given</span>
                  )}
                </p>
              </div>
            ))}

            {(!interview.answers || interview.answers.length === 0) && (
              <p className="text-slate-500 italic">No question details available for this interview.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryDetail;