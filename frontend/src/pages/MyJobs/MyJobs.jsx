import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { Plus, Trash2, Briefcase, MapPin, Calendar } from "lucide-react";

import { getMyJobs, deleteJob } from "../../services/jobService";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const res = await getMyJobs();

      setJobs(res.data.jobs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteJob(id);

      toast.success(res.data.message);

      loadJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <h1 className="text-2xl font-bold text-white">Loading Jobs...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">My Job Posts</h1>

            <p className="mt-2 text-gray-400">
              Manage all your published jobs.
            </p>
          </div>

          <button
            onClick={() => navigate("/recruiter/create-job")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />
            Create New Job
          </button>
        </div>
        {/* ==========================
              JOB LIST
        ========================== */}

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-16 text-center">
            <Briefcase size={60} className="mx-auto mb-6 text-slate-600" />

            <h2 className="text-2xl font-bold text-white">
              No Jobs Posted Yet
            </h2>

            <p className="mt-3 text-gray-400">
              Create your first job posting to start receiving applications.
            </p>

            <button
              onClick={() => navigate("/recruiter/create-job")}
              className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Job
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {job.jobTitle}
                    </h2>

                    <p className="mt-2 text-gray-400">{job.company}</p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                      job.status === "Open" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={18} />

                    {job.location || "Remote"}
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Briefcase size={18} />

                    {job.jobType}
                  </div>

                  <div className="text-green-400 font-semibold">
                    {job.salary || "Not Disclosed"}
                  </div>

                  <div className="text-blue-400">
                    {job.totalApplicants || 0} Applicants
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </div>
                {/* ==========================
                      ACTION BUTTONS
                ========================== */}

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/jobs/edit/${job._id}`)}
                    className="flex-1 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* ==========================
              DASHBOARD STATISTICS
        ========================== */}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-gray-400">Total Jobs</p>

            <h2 className="mt-3 text-4xl font-bold text-white">
              {jobs.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-gray-400">Open Jobs</p>

            <h2 className="mt-3 text-4xl font-bold text-green-400">
              {jobs.filter((job) => job.status === "Open").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-gray-400">Closed Jobs</p>

            <h2 className="mt-3 text-4xl font-bold text-red-400">
              {jobs.filter((job) => job.status === "Closed").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-gray-400">Total Applicants</p>

            <h2 className="mt-3 text-4xl font-bold text-blue-400">
              {jobs.reduce((sum, job) => sum + (job.totalApplicants || 0), 0)}
            </h2>
          </div>
        </div>

        {/* ==========================
              QUICK INSIGHTS
        ========================== */}

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Recruiter Insights
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-slate-800 p-5">
              <h3 className="text-lg font-semibold text-white">
                Active Hiring
              </h3>

              <p className="mt-3 text-gray-400">
                You currently have{" "}
                <span className="font-bold text-green-400">
                  {jobs.filter((job) => job.status === "Open").length}
                </span>{" "}
                active job openings.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <h3 className="text-lg font-semibold text-white">Applications</h3>

              <p className="mt-3 text-gray-400">
                Total applications received:
                <span className="ml-2 font-bold text-blue-400">
                  {jobs.reduce(
                    (sum, job) => sum + (job.totalApplicants || 0),
                    0,
                  )}
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <h3 className="text-lg font-semibold text-white">
                Hiring Status
              </h3>

              <p className="mt-3 text-gray-400">
                Continue posting quality jobs to increase your hiring success.
              </p>
            </div>
          </div>
        </div>
        {/* ==========================
              RECENT ACTIVITY
        ========================== */}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Latest Jobs */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Latest Job Posts
            </h2>

            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="mb-4 rounded-xl bg-slate-800 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{job.jobTitle}</h3>

                    <p className="mt-1 text-sm text-gray-400">{job.company}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      job.status === "Open" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Top Performing Job */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Top Performing Job
            </h2>

            {jobs.length > 0 ? (
              (() => {
                const topJob = [...jobs].sort(
                  (a, b) => (b.totalApplicants || 0) - (a.totalApplicants || 0),
                )[0];

                return (
                  <div className="rounded-xl bg-slate-800 p-6">
                    <h3 className="text-2xl font-bold text-white">
                      {topJob.jobTitle}
                    </h3>

                    <p className="mt-2 text-gray-400">{topJob.company}</p>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Applicants</p>

                        <h4 className="text-3xl font-bold text-blue-400">
                          {topJob.totalApplicants || 0}
                        </h4>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Status</p>

                        <h4 className="text-xl font-bold text-green-400">
                          {topJob.status}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="rounded-xl bg-slate-800 p-6 text-center">
                <p className="text-gray-400">No jobs available.</p>
              </div>
            )}
          </div>
        </div>

        {/* ==========================
              DASHBOARD FOOTER
        ========================== */}

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Recruiter Job Management
          </h2>

          <p className="mt-3 text-gray-400">
            Manage your job openings, track applicants and grow your hiring
            pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyJobs;
