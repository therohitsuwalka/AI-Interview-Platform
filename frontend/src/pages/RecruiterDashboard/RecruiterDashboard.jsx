import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { Users, Briefcase, Trophy, Search, LogOut } from "lucide-react";

import {
  getRecruiterDashboard,
  getCandidates,
} from "../../services/recruiterService";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);

  const [candidates, setCandidates] = useState([]);

  const [search, setSearch] = useState("");

  const loadDashboard = async () => {
    try {
      const dashboardRes = await getRecruiterDashboard();

      setDashboard(dashboardRes.data);

      const candidateRes = await getCandidates();

      setCandidates(candidateRes.data.candidates || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("recruiterToken");

    localStorage.removeItem("recruiter");

    toast.success("Logged out");

    navigate("/recruiter/login");
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const keyword = search.toLowerCase();

    return (
      candidate.name?.toLowerCase().includes(keyword) ||
      candidate.email?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <h1 className="text-2xl font-bold text-white">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Recruiter Dashboard
            </h1>

            <p className="mt-2 text-gray-400">
              Manage candidates and interviews.
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-10">
        {/* ==========================
              DASHBOARD STATS
        ========================== */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Candidates</p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  {dashboard?.stats?.totalCandidates || 0}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-600 p-4">
                <Users className="text-white" size={30} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Interviews</p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  {dashboard?.stats?.totalInterviews || 0}
                </h2>
              </div>

              <div className="rounded-xl bg-green-600 p-4">
                <Briefcase className="text-white" size={30} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Average Score</p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  {dashboard?.stats?.averageScore || 0}%
                </h2>
              </div>

              <div className="rounded-xl bg-yellow-500 p-4">
                <Trophy className="text-white" size={30} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Best Score</p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  {dashboard?.stats?.bestScore || 0}%
                </h2>
              </div>

              <div className="rounded-xl bg-purple-600 p-4">
                <Trophy className="text-white" size={30} />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================
              SEARCH
        ========================== */}

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="relative">
            <Search size={22} className="absolute left-4 top-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search candidate by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-4 pl-14 pr-5 text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* ==========================
              CANDIDATE TABLE
        ========================== */}

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-2xl font-bold text-white">Candidates</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Candidate
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Email
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                    ATS Score
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-400">
                      No Candidates Found
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate._id}
                      className="border-b border-slate-800 hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <h3 className="font-semibold text-white">
                            {candidate.name}
                          </h3>

                          <p className="text-sm text-gray-400">
                            {candidate.phone || "Not Available"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-300">
                        {candidate.email}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                          {candidate.atsScore || 0}%
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                            candidate.status === "Selected"
                              ? "bg-green-600"
                              : candidate.status === "Rejected"
                                ? "bg-red-600"
                                : "bg-yellow-600"
                          }`}
                        >
                          {candidate.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() =>
                            navigate(`/recruiter/candidate/${candidate._id}`)
                          }
                          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                        >
                          View
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
              BOTTOM GRID
        ========================== */}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Recent Activity */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Recent Activity
            </h2>

            {filteredCandidates.length === 0 ? (
              <p className="text-gray-400">No recent activity available.</p>
            ) : (
              <div className="space-y-4">
                {filteredCandidates.slice(0, 5).map((candidate) => (
                  <div
                    key={candidate._id}
                    className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {candidate.name}
                      </h3>

                      <p className="text-sm text-gray-400">{candidate.email}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                        candidate.status === "Selected"
                          ? "bg-green-600"
                          : candidate.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                      }`}
                    >
                      {candidate.status || "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Statistics */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Quick Statistics
            </h2>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-300">Total Candidates</span>

                  <span className="font-semibold text-white">
                    {dashboard?.stats?.totalCandidates || 0}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        (dashboard?.stats?.totalCandidates || 0) * 10,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-300">Average Score</span>

                  <span className="font-semibold text-white">
                    {dashboard?.stats?.averageScore || 0}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-green-600"
                    style={{
                      width: `${dashboard?.stats?.averageScore || 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-300">Best Score</span>

                  <span className="font-semibold text-white">
                    {dashboard?.stats?.bestScore || 0}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-yellow-500"
                    style={{
                      width: `${dashboard?.stats?.bestScore || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ==========================
              PERFORMANCE SUMMARY
        ========================== */}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Top Performers */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Top Performers
            </h2>

            {filteredCandidates.length === 0 ? (
              <p className="text-gray-400">No candidates available.</p>
            ) : (
              filteredCandidates

                .sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0))

                .slice(0, 5)

                .map((candidate, index) => (
                  <div
                    key={candidate._id}
                    className="mb-4 flex items-center justify-between rounded-xl bg-slate-800 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {candidate.name}
                        </h3>

                        <p className="text-sm text-gray-400">
                          {candidate.email}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                      {candidate.atsScore || 0}%
                    </span>
                  </div>
                ))
            )}
          </div>

          {/* Platform Insights */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Platform Insights
            </h2>

            <div className="space-y-5">
              <div className="rounded-xl bg-slate-800 p-5">
                <h3 className="text-lg font-semibold text-white">
                  Hiring Progress
                </h3>

                <p className="mt-2 text-gray-400">
                  You have managed{" "}
                  <span className="font-bold text-white">
                    {dashboard?.stats?.totalCandidates || 0}
                  </span>{" "}
                  candidates through the AI Interview Platform.
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <h3 className="text-lg font-semibold text-white">
                  Interview Performance
                </h3>

                <p className="mt-2 text-gray-400">
                  Average interview score is{" "}
                  <span className="font-bold text-green-400">
                    {dashboard?.stats?.averageScore || 0}%
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <h3 className="text-lg font-semibold text-white">
                  Best Candidate Score
                </h3>

                <p className="mt-2 text-gray-400">
                  Highest ATS Score recorded:
                  <span className="ml-2 font-bold text-yellow-400">
                    {dashboard?.stats?.bestScore || 0}%
                  </span>
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
            Recruiter Dashboard • Industry Level Hiring Platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
