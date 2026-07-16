import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ResumeUpload() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [autoDetectRole, setAutoDetectRole] = useState(true);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
    setMessage("");
  };

  const handleJDFile = (e) => {
    const file = e.target.files[0];
    setJdFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload your Resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("autoDetectRole", autoDetectRole);
    formData.append("targetRole", targetRole);
    formData.append("jobDescription", jobDescription);

    if (jdFile) {
      formData.append("jdFile", jdFile);
    }

    try {
      setLoading(true);
      const res = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/resume-analysis", {
          state: {
            analysis: res.data.analysis,
            analysisId: res.data.analysisId,
            mode: res.data.mode,
          },
        });
      }, 1000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black flex items-center justify-center px-4 py-16 md:px-8">
      <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-12 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-4 animate-pulse">
              AI-Powered Evaluation
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
              Resume ATS Analyzer
            </h1>
            <p className="text-slate-400 mt-4 text-base md:text-lg font-medium leading-relaxed">
              Optimize your profile for modern Applicant Tracking Systems. Upload your CV, compare it against targets, and land more tech interviews.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION 1: Upload Resume */}
            <div className="group transition-all duration-300">
              <label className="block text-slate-200 text-lg font-bold mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">1</span>
                Upload Resume <span className="text-rose-500">*</span>
              </label>
              
              <label
                htmlFor="resume"
                className={`flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed ${
                  resume ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/30'
                } transition-all duration-300 backdrop-blur-sm relative group`}
              >
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <span className={`text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 ${resume ? 'text-blue-400' : 'text-slate-400'}`}>
                    📄
                  </span>
                  <p className="text-lg font-bold text-slate-100 max-w-md truncate px-4">
                    {resume ? resume.name : "Click here or drag to choose Resume"}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide uppercase bg-slate-800 px-3 py-1 rounded-md border border-white/5">
                    Supported: PDF / DOC / DOCX
                  </p>
                </div>
              </label>
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SECTION 2: Target Job Role */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">2</span>
                    Target Job Role
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Select how you want to match your engineering background. Auto Detect is highly recommended.
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      autoDetectRole 
                        ? 'bg-blue-500/10 border-blue-500/40 text-white font-semibold' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                    }`}>
                      <input
                        type="radio"
                        name="roleOption"
                        className="accent-blue-500 h-4 w-4"
                        checked={autoDetectRole}
                        onChange={() => {
                          setAutoDetectRole(true);
                          setTargetRole("");
                        }}
                      />
                      <span>Auto Detect Role</span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      !autoDetectRole 
                        ? 'bg-blue-500/10 border-blue-500/40 text-white font-semibold' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                    }`}>
                      <input
                        type="radio"
                        name="roleOption"
                        className="accent-blue-500 h-4 w-4"
                        checked={!autoDetectRole}
                        onChange={() => setAutoDetectRole(false)}
                      />
                      <span>Manual Target</span>
                    </label>
                  </div>
                </div>

                {!autoDetectRole && (
                  <div className="mt-6 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Example: AI Engineer"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 shadow-inner placeholder-slate-600 font-medium"
                    />
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Popular Tracks:</p>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                          "Python Developer", "Java Developer", "Flutter Developer", 
                          "Data Analyst", "AI Engineer", "DevOps Engineer", 
                          "Cyber Security", "HR Executive", "Digital Marketing", 
                          "Civil Engineer", "Mechanical Engineer", "QA Engineer"
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setTargetRole(role)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-white/5 transition"
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Job Description */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 transition-all duration-300 hover:border-slate-700">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm">3</span>
                  Job Description <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-white/5 ml-1">Optional</span>
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Provide target benchmark targets via PDF upload or text pasting for targeted alignment mapping.
                </p>

                <div className="mt-6 space-y-4">
                  <label
                    htmlFor="jdFile"
                    className={`flex h-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed ${
                      jdFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/30'
                    } transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3 px-4">
                      <span className={`text-2xl ${jdFile ? 'text-emerald-400' : 'text-slate-500'}`}>📑</span>
                      <p className="text-sm font-semibold text-slate-200 max-w-xs truncate">
                        {jdFile ? jdFile.name : "Upload Job Description PDF"}
                      </p>
                    </div>
                  </label>
                  <input
                    id="jdFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleJDFile}
                    className="hidden"
                  />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-800/80"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-wider">
                      <span className="bg-slate-900/10 px-3 text-slate-500 font-bold backdrop-blur-sm">OR PASTE TEXT</span>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste complete performance profiles or requirements here..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none placeholder-slate-600 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: AI Analysis Preview Card */}
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent backdrop-blur-sm p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">4</span>
                    Analysis Preview Dashboard
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Your generated reporting pipeline yields the following dynamic data points.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start sm:self-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Preview Mode</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ATS Core Score</p>
                  <p className="text-2xl font-black text-blue-400 mt-1">-- <span className="text-xs font-normal text-slate-600">/ 100</span></p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detected Role</p>
                  <p className="text-base font-bold text-slate-300 mt-2 truncate">Pending Scan...</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compared Against</p>
                  <p className="text-base font-bold text-slate-300 mt-2 truncate">Target Framework</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interview Readiness</p>
                  <p className="text-base font-bold text-slate-300 mt-2">Evaluation Pending</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/50 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span className="text-emerald-400">✔</span> Diagnostic Vectors
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1.5 font-medium">
                    <li className="flex items-center gap-2"><span className="text-blue-500/60">•</span> Comprehensive Missing Skills Mapping</li>
                    <li className="flex items-center gap-2"><span className="text-blue-500/60">•</span> Identified Strengths & Competitive Assets</li>
                    <li className="flex items-center gap-2"><span className="text-blue-500/60">•</span> Formatting Weaknesses & Parsing Gaps</li>
                  </ul>
                </div>

                <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/50 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span className="text-blue-400">💡</span> Optimization Roadmaps
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1.5 font-medium">
                    <li className="flex items-center gap-2"><span className="text-emerald-500/60">•</span> Bullet-by-Bullet Resume Improvements</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500/60">•</span> Tailored Project Recommendations</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500/60">•</span> Curated Certifications & Upskilling Links</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 5: Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-5 text-lg font-bold text-white transition-all duration-300 hover:opacity-95 shadow-xl shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="tracking-wide">Parsing & Engine Assessment in Progress...</span>
                </>
              ) : (
                <>
                  <span>Analyze Resume & Compute Score</span>
                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">⚡</span>
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 rounded-2xl p-4 text-center font-semibold text-base border transition-all duration-300 animate-fadeIn ${
                message.toLowerCase().includes("failed") || message.toLowerCase().includes("error")
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Feature Highlights Grid */}
          <div className="mt-16 grid gap-6 grid-cols-1 md:grid-cols-3 border-t border-slate-800/60 pt-12">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 transition-all duration-300 hover:bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xl font-bold mb-4">🤖</div>
              <h3 className="text-lg font-bold text-slate-100">AI Role Detection</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Automatically detects the most suitable career track and professional categorization directly from your experiences.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 transition-all duration-300 hover:bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl font-bold mb-4">📊</div>
              <h3 className="text-lg font-bold text-slate-100">ATS Structural Deep-Scan</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Expose semantic blind spots, structural syntax faults, or keyword shortfalls restricting system readability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 transition-all duration-300 hover:bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl font-bold mb-4">🎯</div>
              <h3 className="text-lg font-bold text-slate-100">JD Contextual Matching</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Upload target vacancy briefs to generate a weighted similarity report measuring direct contextual relevance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;