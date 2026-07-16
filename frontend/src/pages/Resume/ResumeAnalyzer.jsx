import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Briefcase, 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  Percent, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  FolderGit2, 
  ArrowLeft, 
  Play, 
  AlertTriangle, 
  Check 
} from "lucide-react";

import ScoreCircle from "../../components/Resume/ScoreCircle";
import SectionCard from "../../components/Resume/SectionCard";

function ResumeAnalyzer() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const analysis = state?.analysis;
  const analysisId = state?.analysisId;
  const mode = state?.mode;
  const isJDBased = mode === "JD_BASED";

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-10 text-center shadow-2xl">
          <BarChart3 className="mx-auto text-cyan-400" size={60} />

          <h1 className="mt-6 text-4xl font-bold text-white">
            No Resume Analysis Found
          </h1>

          <p className="mt-4 text-lg text-gray-400">
            Please upload your resume before starting the AI interview.
          </p>

          <button
            onClick={() => navigate("/resume-upload")}
            className="mt-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:scale-105"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-black text-slate-100">
      <div className="mx-auto max-w-7xl p-4 md:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
                Analysis Matrix Complete
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Resume ATS Report
            </h1>
            <p className="mt-2 text-base md:text-lg text-slate-400">
              AI-Powered Evaluation Dashboard & Competency Analysis
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/resume-upload")}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10 active:scale-95"
            >
              <ArrowLeft size={18} />
              Re-Upload
            </button>
          </div>
        </div>

        {/* TOP SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors">
              <Briefcase size={48} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Role</p>
              <h3 className="text-xl font-black text-white mt-2 truncate">
                {analysis.detectedRole || analysis.suitableRoles?.[0] || "Not Detected"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-4">Extracted classification profile</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
              <ShieldCheck size={48} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compared Against</p>
              <h3 className="text-xl font-black text-white mt-2 truncate">
                {isJDBased ? "Job Description" : (analysis.targetRole || "Market Benchmark")}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-4">Target baseline parameters</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
              <Percent size={48} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isJDBased ? "JD Match Score" : "ATS Score"}
              </p>
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-1">
                {isJDBased ? (analysis.matchScore ?? "--") : (analysis.atsScore ?? "--")}%
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              {isJDBased ? "How well this resume fits the job you provided" : "AI model alignment calibration"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
              <TrendingUp size={48} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interview Readiness</p>
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mt-1">
                {analysis.interviewReadinessPercent || analysis.interviewReadiness || "82"}%
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-4">Evaluated domain competency readiness</p>
          </div>
        </div>

        {/* MAIN DASHBOARD BLOCK */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ATS Scoring Metric */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col items-center justify-center shadow-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl pointer-events-none"></div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">ATS Match Engine Rating</p>
            <ScoreCircle score={analysis.atsScore} />
            <div className="mt-6 text-center max-w-xs">
              <p className="text-xs text-slate-400 leading-relaxed">
                This indexing shows compatibility score calculations mapped over layout readability and core density parameters.
              </p>
            </div>
          </div>

          {/* Core Standard Sections Mapping */}
          <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
            <SectionCard title="Skills" color="green" items={analysis.skills} />

            {isJDBased && (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-white/5 pb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Matched With This Job
                </h3>
                <div className="flex flex-wrap gap-2 mt-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {analysis.matchedSkills && analysis.matchedSkills.length > 0 ? (
                    analysis.matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No overlapping skills detected against this job.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Custom Missing Skills Badges Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg">
              <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 border-b border-white/5 pb-3">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2 mt-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No structural omissions observed.</p>
                )}
              </div>
            </div>

            {/* Strengths Custom Styled Display */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md p-6 shadow-lg">
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
                <CheckCircle2 size={18} className="text-emerald-400" />
                Strengths
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-emerald-300/90 font-medium max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {analysis.strengths && analysis.strengths.length > 0 ? (
                  analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">Insufficient parameters parsed.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses Custom Styled Display */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md p-6 shadow-lg">
              <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 border-b border-rose-500/10 pb-3">
                <AlertTriangle size={18} className="text-rose-400" />
                Weaknesses
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-rose-300/90 font-medium max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                  analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold mt-0.5">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No vital flaws flagged.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Resume Improvements Section */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 border-b border-white/5 pb-4">
            <Sparkles className="text-amber-400" size={24} />
            Targeted Action Items & Checklist
          </h2>
          <div className="mt-6 grid gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {(analysis.suggestions || analysis.resumeImprovements)?.length > 0 ? (
              (analysis.suggestions || analysis.resumeImprovements).map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm hover:border-white/10 transition duration-200"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <p className="text-sm md:text-base font-medium text-slate-300 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic text-sm">No adjustments necessary for this profile layout track.</p>
            )}
          </div>
        </div>

        {/* Recommended Tracks Sub-Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Recommended Projects Card Stack */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5 border-b border-white/5 pb-4 mb-6">
              <FolderGit2 className="text-blue-400" size={22} />
              Recommended Architectural Projects
            </h2>
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {analysis.recommendedProjects && analysis.recommendedProjects.length > 0 ? (
                analysis.recommendedProjects.map((project, index) => {
                  const isObject = typeof project === "object" && project !== null;
                  const title = isObject ? (project.title || project.name) : `Project Plan Block #${index + 1}`;
                  const description = isObject ? (project.description || project.details) : String(project);

                  return (
                    <div 
                      key={index} 
                      className="group p-5 rounded-2xl border border-white/5 bg-slate-950/50 backdrop-blur-sm hover:border-blue-500/30 hover:bg-slate-950/80 transition-all duration-300"
                    >
                      <h3 className="text-base font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {title}
                      </h3>
                      <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 italic text-sm">No specialized deployment scenarios suggested at this juncture.</p>
              )}
            </div>
          </div>

          {/* Recommended Certifications Card Stack */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5 border-b border-white/5 pb-4 mb-6">
              <Award className="text-purple-400" size={22} />
              Target Certifications & Validation Pathways
            </h2>
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {analysis.recommendedCertifications && analysis.recommendedCertifications.length > 0 ? (
                analysis.recommendedCertifications.map((cert, index) => {
                  const isObject = typeof cert === "object" && cert !== null;
                  const name = isObject ? (cert.name || cert.title) : String(cert);
                  const provider = isObject ? (cert.provider || cert.issuer) : "Industry Standard Credential";

                  return (
                    <div 
                      key={index} 
                      className="group p-5 rounded-2xl border border-white/5 bg-slate-950/50 backdrop-blur-sm hover:border-purple-500/30 hover:bg-slate-950/80 transition-all duration-300 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-base font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
                          {name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">
                          {provider}
                        </p>
                      </div>
                      <span className="text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-md shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        View Map
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 italic text-sm">Profile demonstrates extensive structural certifications.</p>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-white/10 pt-8">
          <button
            onClick={() => navigate("/resume-upload")}
            className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-slate-300 transition hover:bg-white/10 active:scale-98"
          >
            Analyze Another Resume
          </button>
          
          <button
            onClick={() => navigate("/interview-setup", {
              state: { analysis, analysisId, mode },
            })}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-500/10 transition hover:opacity-95 active:scale-98"
          >
            <Play size={18} className="fill-current" />
            Practice AI Interview
          </button>
        </div>

      </div>
    </div>
  );
}

export default ResumeAnalyzer;