import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Trophy,
} from "lucide-react";

import {
  getCandidateDetails,
} from "../../services/recruiterService";

function RecruiterCandidate() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [candidate, setCandidate] = useState(null);

  const [interviews, setInterviews] = useState([]);

  const [stats, setStats] = useState({});

  const loadCandidate = async () => {

    try {

      const res =
        await getCandidateDetails(id);

      setCandidate(res.data.candidate);

      setInterviews(
        res.data.interviews || []
      );

      setStats(
        res.data.stats || {}
      );

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Failed to load candidate."

      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadCandidate();

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <h1 className="text-2xl font-bold text-white">

          Loading Candidate...

        </h1>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-950">

      <div className="border-b border-slate-800 bg-slate-900">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

          <div>

            <button

              onClick={() => navigate(-1)}

              className="mb-4 flex items-center gap-2 text-blue-400 hover:text-blue-300"

            >

              <ArrowLeft size={20} />

              Back

            </button>

            <h1 className="text-4xl font-bold text-white">

              Candidate Profile

            </h1>

          </div>

        </div>

      </div>

      <div className="mx-auto max-w-7xl px-8 py-10">
              {/* ==========================
              PROFILE + STATS
        ========================== */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Candidate Information */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex flex-col items-center">

              <img
                src={
                  candidate?.profileImage ||
                  "https://ui-avatars.com/api/?name=Candidate"
                }
                alt="Candidate"
                className="h-32 w-32 rounded-full border-4 border-slate-700 object-cover"
              />

              <h2 className="mt-5 text-2xl font-bold text-white">

                {candidate?.name}

              </h2>

              <p className="mt-2 flex items-center gap-2 text-gray-400">

                <Mail size={18} />

                {candidate?.email}

              </p>

              <p className="mt-2 flex items-center gap-2 text-gray-400">

                <Phone size={18} />

                {candidate?.phone || "Not Available"}

              </p>

              {candidate?.resume && (

                <a
                  href={candidate.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >

                  <FileText size={20} />

                  View Resume

                </a>

              )}

            </div>

          </div>

          {/* Statistics */}

          <div className="lg:col-span-2">

            <div className="grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <p className="text-gray-400">

                  Total Interviews

                </p>

                <h2 className="mt-3 text-4xl font-bold text-white">

                  {stats?.totalInterviews || 0}

                </h2>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <p className="text-gray-400">

                  Average Score

                </p>

                <h2 className="mt-3 text-4xl font-bold text-green-400">

                  {stats?.averageScore || 0}%

                </h2>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <p className="text-gray-400">

                  Best Score

                </p>

                <h2 className="mt-3 flex items-center gap-2 text-4xl font-bold text-yellow-400">

                  <Trophy size={30} />

                  {stats?.bestScore || 0}%

                </h2>

              </div>

            </div>

          </div>

        </div>
                {/* ==========================
              INTERVIEW HISTORY
        ========================== */}

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-6 py-5">

            <h2 className="text-2xl font-bold text-white">

              Interview History

            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-800">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">

                    Date

                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">

                    Domain

                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">

                    Score

                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">

                    Performance

                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">

                    Result

                  </th>

                </tr>

              </thead>

              <tbody>

                {interviews.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-10 text-center text-gray-400"
                    >

                      No Interview Found

                    </td>

                  </tr>

                ) : (

                  interviews.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b border-slate-800 hover:bg-slate-800/40"
                    >

                      <td className="px-6 py-5 text-gray-300">

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-5 text-gray-300">

                        {item.role ||
                          item.domain ||
                          "General"}

                      </td>

                      <td className="px-6 py-5 text-center">

                        <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">

                          {item.overallScore || 0}%

                        </span>

                      </td>

                      <td className="px-6 py-5 text-center">

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                            (item.overallScore || 0) >= 80
                              ? "bg-green-600"
                              : (item.overallScore || 0) >= 60
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                        >

                          {(item.overallScore || 0) >= 80
                            ? "Excellent"
                            : (item.overallScore || 0) >= 60
                            ? "Good"
                            : "Needs Improvement"}

                        </span>

                      </td>

                      <td className="px-6 py-5 text-center">

                        <button
                          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700"
                        >

                          View Result

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>
                {/* ==========================
              PERFORMANCE ANALYTICS
        ========================== */}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          {/* Performance Summary */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">

              Performance Summary

            </h2>

            <div className="space-y-6">

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-gray-300">

                    Average Score

                  </span>

                  <span className="font-semibold text-green-400">

                    {stats?.averageScore || 0}%

                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800">

                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{
                      width: `${stats?.averageScore || 0}%`,
                    }}
                  />

                </div>

              </div>

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-gray-300">

                    Best Score

                  </span>

                  <span className="font-semibold text-yellow-400">

                    {stats?.bestScore || 0}%

                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800">

                  <div
                    className="h-3 rounded-full bg-yellow-500"
                    style={{
                      width: `${stats?.bestScore || 0}%`,
                    }}
                  />

                </div>

              </div>

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-gray-300">

                    Interview Completion

                  </span>

                  <span className="font-semibold text-blue-400">

                    {stats?.totalInterviews || 0}

                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800">

                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        (stats?.totalInterviews || 0) * 10,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Recruiter Insights */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">

              Recruiter Insights

            </h2>

            <div className="space-y-5">

              <div className="rounded-xl bg-slate-800 p-5">

                <h3 className="font-semibold text-white">

                  Overall Assessment

                </h3>

                <p className="mt-2 text-gray-400">

                  {(stats?.averageScore || 0) >= 80
                    ? "Excellent candidate with strong interview performance."
                    : (stats?.averageScore || 0) >= 60
                    ? "Good candidate. Suitable for technical discussion."
                    : "Candidate needs improvement before moving to the next hiring stage."}

                </p>

              </div>

              <div className="rounded-xl bg-slate-800 p-5">

                <h3 className="font-semibold text-white">

                  Recommendation

                </h3>

                <p className="mt-2 text-gray-400">

                  {(stats?.averageScore || 0) >= 80
                    ? "✅ Recommended for next interview round."
                    : (stats?.averageScore || 0) >= 60
                    ? "🟡 Keep under consideration."
                    : "❌ Not recommended currently."}

                </p>

              </div>

              <div className="rounded-xl bg-slate-800 p-5">

                <h3 className="font-semibold text-white">

                  Resume Status

                </h3>

                <p className="mt-2 text-gray-400">

                  {candidate?.resume
                    ? "Resume uploaded and available for review."
                    : "Resume not uploaded."}

                </p>

              </div>

            </div>

          </div>

        </div>
                {/* ==========================
              FOOTER
        ========================== */}

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">

          <h2 className="text-2xl font-bold text-white">

            AI Interview Platform

          </h2>

          <p className="mt-3 text-gray-400">

            Recruiter Candidate Dashboard • AI Powered Hiring Platform

          </p>

        </div>

      </div>

    </div>

  );

}

export default RecruiterCandidate;