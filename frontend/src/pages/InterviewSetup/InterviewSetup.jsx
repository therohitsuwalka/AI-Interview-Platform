import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateInterview } from "../../services/interviewService";
import {
  Briefcase,
  Building2,
  Layers,
  Sparkles,
  Play,
  ArrowLeft,
  Target,
  Code2,
  X,
} from "lucide-react";

function InterviewSetup() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Resume analysis context (optional) - carried over from ResumeAnalyzer.
  // Interview Setup works completely fine without this - Resume ATS and
  // Interview are independent features; this is just an optional boost.
  const analysis = state?.analysis || null;
  const analysisId = state?.analysisId || null;
  const mode = state?.mode || null;
  const isJDBased = mode === "JD_BASED";
  const hasResume = Boolean(analysis);

  const [formData, setFormData] = useState({
    company: "",
    role: analysis?.suitableRoles?.[0] || analysis?.targetRole || "",
    experience: "",
    difficulty: "Medium",
    questions: 10,
  });

  // Manual skills - only relevant when there's no resume linked. Lets a
  // fresher with no resume still get a personalized interview by simply
  // typing the skills they know.
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    const value = skillInput.trim().replace(/,+$/, "");
    if (!value) return;

    if (!skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkills([...skills, value]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const payload = {
        ...formData,
        questions: Number(formData.questions),
        analysisId: analysisId || undefined,
        // Only sent when there's no resume - the backend will use these
        // to personalize questions instead of resume-derived skills.
        manualSkills: !hasResume && skills.length > 0 ? skills : undefined,
      };

      const res = await generateInterview(payload);

      localStorage.setItem("questions", JSON.stringify(res.data.questions));

      // analysisId travels with interviewData so the Result page can link
      // the completed interview back to this resume/JD analysis.
      localStorage.setItem(
        "interviewData",
        JSON.stringify({ ...formData, analysisId: analysisId || null, skills })
      );

      navigate("/interview");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Unable to generate interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black flex items-center justify-center px-4 py-16 md:px-8">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-12 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-4">
              Interview Setup
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
              Setup Your Interview
            </h1>
            <p className="text-slate-400 mt-4 text-base font-medium leading-relaxed">
              {hasResume
                ? `The AI will tailor questions around your resume${isJDBased ? " and the job description you provided" : ""}.`
                : "No resume needed - just tell us the role and (optionally) your skills."}
            </p>
          </div>

          {/* Context banner */}
          {hasResume ? (
            <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-3">
              <Target className="text-emerald-400 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-bold text-emerald-300">
                  {isJDBased
                    ? `Using your resume + job description (Match Score: ${analysis.matchScore ?? "--"}%)`
                    : "Using your uploaded resume analysis"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Questions will focus on your {isJDBased ? "missing/weak skills for this job" : "detected strengths and gaps"}.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 flex items-start gap-3">
              <Sparkles className="text-blue-400 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-bold text-blue-300">Practicing without a resume</p>
                <p className="text-xs text-slate-400 mt-1">
                  Add the skills you know below for a more personalized interview, or leave it
                  blank for general questions based on the role.{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/resume-upload")}
                    className="underline hover:text-blue-300"
                  >
                    Have a resume? Upload it instead
                  </button>
                  .
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  <Building2 size={16} className="text-blue-400" />
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Google, Amazon, TCS..."
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  <Briefcase size={16} className="text-blue-400" />
                  Job Role
                </label>
                <input
                  type="text"
                  name="role"
                  placeholder="Python Developer, Frontend Developer..."
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  <Layers size={16} className="text-blue-400" />
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  placeholder="Fresher / 1 Year / 3 Years"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Manual Skills input - only shown when there's no resume linked */}
            {!hasResume && (
              <div>
                <label className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  <Code2 size={16} className="text-blue-400" />
                  Your Skills <span className="text-slate-500 font-normal">(optional)</span>
                </label>

                <div className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-white transition"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      onBlur={addSkill}
                      placeholder={
                        skills.length === 0
                          ? "Type a skill and press Enter (e.g. React, Node.js, SQL)"
                          : "Add another..."
                      }
                      className="flex-1 min-w-[160px] bg-transparent text-slate-200 outline-none py-1.5 placeholder-slate-600"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Press Enter or comma after each skill. Leave empty for general role-based questions.
                </p>
              </div>
            )}

            <div>
              <label className="flex items-center justify-between text-slate-200 font-semibold mb-2">
                <span>Number of Questions</span>
                <span className="text-blue-400">{formData.questions}</span>
              </label>
              <input
                type="range"
                name="questions"
                min="5"
                max="20"
                value={formData.questions}
                onChange={handleChange}
                className="w-full accent-blue-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 p-4 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-slate-300 hover:bg-white/10 transition"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-4 text-lg font-bold text-white transition hover:opacity-95 shadow-xl shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Generating Interview..."
                ) : (
                  <>
                    <Play size={18} className="fill-current" />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InterviewSetup;