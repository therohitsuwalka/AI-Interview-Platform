import { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import {
  getProblems,
  getProblemById,
  runCode,
  submitCode,
} from "../../services/codingService";
import {
  Play,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

const LANGUAGE_META = {
  javascript: { label: "JavaScript", monaco: "javascript" },
  python: { label: "Python", monaco: "python" },
  cpp: { label: "C++", monaco: "cpp" },
  java: { label: "Java", monaco: "java" },
  sql: { label: "SQL", monaco: "sql" },
};

const DIFFICULTY_COLOR = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const TIME_LIMIT_SECONDS = 30 * 60; // 30 minute coding round timer

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function CodingRound() {
  const [problems, setProblems] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const startedAtRef = useRef(Date.now());

  // Load problem list
  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await getProblems();
        setProblems(res.data.problems);
        setLanguages(res.data.languages);

        if (res.data.problems.length > 0) {
          loadProblem(res.data.problems[0].id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load coding problems.");
      }
    };

    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProblem = useCallback(async (problemId) => {
    try {
      setLoadingProblem(true);
      setRunResult(null);
      setSubmitResult(null);

      const res = await getProblemById(problemId);
      setActiveProblem(res.data.problem);
      setCode(res.data.problem.starterCode[language] || "");
      startedAtRef.current = Date.now();
      setTimeLeft(TIME_LIMIT_SECONDS);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load problem.");
    } finally {
      setLoadingProblem(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (activeProblem) {
      setCode(activeProblem.starterCode[newLang] || "");
    }
    setRunResult(null);
    setSubmitResult(null);
  };

  const handleRun = async () => {
    if (!activeProblem) return;

    try {
      setRunning(true);
      setRunResult(null);

      const res = await runCode({
        problemId: activeProblem.id,
        language,
        code,
      });

      setRunResult(res.data);

      if (res.data.passedCount === res.data.totalCount) {
        toast.success("All sample test cases passed!");
      } else {
        toast(`${res.data.passedCount}/${res.data.totalCount} sample tests passed`, {
          icon: "⚠️",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to run code.");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeProblem) return;

    try {
      setSubmitting(true);
      setSubmitResult(null);

      const timeTakenSeconds = Math.round((Date.now() - startedAtRef.current) / 1000);

      const res = await submitCode({
        problemId: activeProblem.id,
        language,
        code,
        timeTakenSeconds,
      });

      setSubmitResult(res.data);

      if (res.data.verdict === "Accepted") {
        toast.success("Accepted! 🎉 All test cases passed.");
      } else {
        toast.error(`Verdict: ${res.data.verdict}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* LEFT: Problem list + statement */}
      <div className="lg:w-[38%] border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white mb-4">Coding Round</h1>

          <div className="flex flex-wrap gap-2">
            {problems.map((p) => (
              <button
                key={p.id}
                onClick={() => loadProblem(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  activeProblem?.id === p.id
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loadingProblem || !activeProblem ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin text-blue-400" size={28} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-white">{activeProblem.title}</h2>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    DIFFICULTY_COLOR[activeProblem.difficulty] || DIFFICULTY_COLOR.Easy
                  }`}
                >
                  {activeProblem.difficulty}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {activeProblem.statement}
              </p>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Constraints
                </h3>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  {activeProblem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Input / Output Format
                </h3>
                <p className="text-xs text-slate-400 whitespace-pre-line">
                  <strong className="text-slate-300">Input:</strong> {activeProblem.inputFormat}
                  {"\n"}
                  <strong className="text-slate-300">Output:</strong> {activeProblem.outputFormat}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Sample Test Cases
                </h3>
                {activeProblem.sampleTestCases.map((tc, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs font-bold text-slate-500 mb-1">Input</p>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap mb-3 font-mono">
                      {tc.input}
                    </pre>
                    <p className="text-xs font-bold text-slate-500 mb-1">Expected Output</p>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                      {tc.output}
                    </pre>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Editor + controls */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm font-semibold rounded-xl pl-4 pr-9 py-2.5 outline-none focus:border-blue-500 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_META[lang]?.label || lang}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm ${
              timeLeft < 60
                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                : "border-slate-700 bg-slate-800 text-slate-200"
            }`}
          >
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex-1 min-h-[400px]">
          <Editor
            height="100%"
            language={LANGUAGE_META[language]?.monaco || "javascript"}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>

        <div className="border-t border-slate-800 bg-slate-900/40 p-6">
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleRun}
              disabled={running || submitting || !activeProblem}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-700 transition disabled:opacity-50"
            >
              {running ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
              Run
            </button>

            <button
              onClick={handleSubmit}
              disabled={running || submitting || !activeProblem}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white hover:opacity-95 transition disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Submit
            </button>
          </div>

          {/* Run results (sample test cases) */}
          {runResult && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 max-h-48 overflow-y-auto">
              <p className="text-sm font-bold text-slate-300 mb-2">
                Sample Results: {runResult.passedCount}/{runResult.totalCount} passed
              </p>
              <div className="space-y-2">
                {runResult.results.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    {r.passed ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-300">Test {i + 1}:</span>{" "}
                      {r.passed
                        ? "Passed"
                        : r.error || `Expected "${r.expected}", got "${r.actual}"`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit results (hidden + sample, verdict only) */}
          {submitResult && (
            <div
              className={`mt-4 rounded-xl border p-4 ${
                submitResult.verdict === "Accepted"
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <p
                className={`text-sm font-bold ${
                  submitResult.verdict === "Accepted" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {submitResult.verdict} — {submitResult.passedCount}/{submitResult.totalCount} test
                cases passed
              </p>
            </div>
          )}

          {/* AI Code Review */}
          {submitResult?.aiReview && (
            <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="text-sm font-bold text-indigo-300 mb-3">🤖 AI Code Review</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg bg-slate-900/60 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Time Complexity
                  </p>
                  <p className="text-sm font-mono text-slate-200 mt-1">
                    {submitResult.aiReview.timeComplexity}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Space Complexity
                  </p>
                  <p className="text-sm font-mono text-slate-200 mt-1">
                    {submitResult.aiReview.spaceComplexity}
                  </p>
                </div>
              </div>

              {submitResult.aiReview.optimization && (
                <p className="text-xs text-slate-300 mb-2">
                  <span className="font-bold text-slate-400">Optimization: </span>
                  {submitResult.aiReview.optimization}
                </p>
              )}

              {submitResult.aiReview.codeQuality && (
                <p className="text-xs text-slate-300 mb-2">
                  <span className="font-bold text-slate-400">Code Quality: </span>
                  {submitResult.aiReview.codeQuality}
                </p>
              )}

              {submitResult.aiReview.hint && (
                <p className="text-xs text-amber-300">
                  <span className="font-bold">💡 Hint: </span>
                  {submitResult.aiReview.hint}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodingRound;
