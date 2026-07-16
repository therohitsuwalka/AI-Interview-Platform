import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  IndianRupee,
} from "lucide-react";

import { getJobById } from "../../services/jobService";

function ViewJob() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [job, setJob] = useState(null);

  const loadJob = async () => {

    try {

      const res = await getJobById(id);

      setJob(res.data.job);

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Failed to load job."

      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadJob();

  }, []);

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-950">

        <h1 className="text-2xl font-bold text-white">

          Loading Job...

        </h1>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-950">

      <div className="mx-auto max-w-6xl px-8 py-10">

        <button

          onClick={() => navigate(-1)}

          className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300"

        >

          <ArrowLeft size={20} />

          Back

        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h1 className="text-4xl font-bold text-white">

            {job?.jobTitle}

          </h1>

          <p className="mt-3 text-gray-400">

            Complete Job Information

          </p>
                    {/* ==========================
                JOB DETAILS
          ========================== */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-5">

              <Building2
                size={24}
                className="text-blue-400"
              />

              <div>

                <p className="text-sm text-gray-400">

                  Company

                </p>

                <h3 className="text-lg font-semibold text-white">

                  {job?.company}

                </h3>

              </div>

            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-5">

              <MapPin
                size={24}
                className="text-green-400"
              />

              <div>

                <p className="text-sm text-gray-400">

                  Location

                </p>

                <h3 className="text-lg font-semibold text-white">

                  {job?.location || "Remote"}

                </h3>

              </div>

            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-5">

              <Briefcase
                size={24}
                className="text-yellow-400"
              />

              <div>

                <p className="text-sm text-gray-400">

                  Job Type

                </p>

                <h3 className="text-lg font-semibold text-white">

                  {job?.jobType}

                </h3>

              </div>

            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-5">

              <IndianRupee
                size={24}
                className="text-emerald-400"
              />

              <div>

                <p className="text-sm text-gray-400">

                  Salary

                </p>

                <h3 className="text-lg font-semibold text-white">

                  {job?.salary || "Not Disclosed"}

                </h3>

              </div>

            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-5">

              <Calendar
                size={24}
                className="text-purple-400"
              />

              <div>

                <p className="text-sm text-gray-400">

                  Application Deadline

                </p>

                <h3 className="text-lg font-semibold text-white">

                  {job?.expiresAt
                    ? new Date(
                        job.expiresAt
                      ).toLocaleDateString()
                    : "No Deadline"}

                </h3>

              </div>

            </div>

            <div className="rounded-xl bg-slate-800 p-5">

              <p className="text-sm text-gray-400">

                Total Applicants

              </p>

              <h3 className="mt-2 text-3xl font-bold text-blue-400">

                {job?.totalApplicants || 0}

              </h3>

            </div>

          </div>
                    {/* ==========================
                REQUIRED SKILLS
          ========================== */}

          <div className="mt-10">

            <h2 className="mb-5 text-2xl font-bold text-white">

              Required Skills

            </h2>

            <div className="flex flex-wrap gap-3">

              {job?.skills?.length > 0 ? (

                job.skills.map((skill, index) => (

                  <span
                    key={index}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >

                    {skill}

                  </span>

                ))

              ) : (

                <span className="text-gray-400">

                  No skills specified.

                </span>

              )}

            </div>

          </div>

          {/* ==========================
                JOB DESCRIPTION
          ========================== */}

          <div className="mt-10">

            <h2 className="mb-5 text-2xl font-bold text-white">

              Job Description

            </h2>

            <div className="rounded-2xl bg-slate-800 p-6">

              <p className="whitespace-pre-wrap leading-8 text-gray-300">

                {job?.description}

              </p>

            </div>

          </div>

          {/* ==========================
                JOB STATUS
          ========================== */}

          <div className="mt-10 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800 p-6">

            <div>

              <p className="text-gray-400">

                Current Status

              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">

                {job?.status}

              </h2>

            </div>

            <span
              className={`rounded-full px-6 py-3 font-semibold text-white ${
                job?.status === "Open"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {job?.status}
            </span>

          </div>
                    {/* ==========================
                JOB ANALYTICS
          ========================== */}

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-800 p-6">

              <p className="text-sm text-gray-400">

                Total Applicants

              </p>

              <h2 className="mt-3 text-4xl font-bold text-blue-400">

                {job?.totalApplicants || 0}

              </h2>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800 p-6">

              <p className="text-sm text-gray-400">

                Posted On

              </p>

              <h2 className="mt-3 text-xl font-bold text-white">

                {job?.createdAt
                  ? new Date(
                      job.createdAt
                    ).toLocaleDateString()
                  : "-"}

              </h2>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800 p-6">

              <p className="text-sm text-gray-400">

                Expires On

              </p>

              <h2 className="mt-3 text-xl font-bold text-white">

                {job?.expiresAt
                  ? new Date(
                      job.expiresAt
                    ).toLocaleDateString()
                  : "No Expiry"}

              </h2>

            </div>

          </div>

          {/* ==========================
                RECRUITER INSIGHTS
          ========================== */}

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <h2 className="mb-6 text-2xl font-bold text-white">

              Recruiter Insights

            </h2>

            <div className="grid gap-6 md:grid-cols-3">

              <div className="rounded-xl bg-slate-800 p-5">

                <h3 className="font-semibold text-white">

                  Hiring Progress

                </h3>

                <p className="mt-3 text-gray-400">

                  {job?.totalApplicants > 0
                    ? `${job.totalApplicants} candidates have applied for this job.`
                    : "No candidates have applied yet."}

                </p>

              </div>

              <div className="rounded-xl bg-slate-800 p-5">

                <h3 className="font-semibold text-white">

                  Job Visibility

                </h3>

                <p className="mt-3 text-gray-400">

                  {job?.status === "Open"
                    ? "This job is currently visible to candidates."
                    : "This job is closed and no longer accepting applications."}

                </p>

              </div>

              <div className="rounded-xl bg-slate-800 p-5">

                <h3 className="font-semibold text-white">

                  Recommendation

                </h3>

                <p className="mt-3 text-gray-400">

                  {job?.status === "Open"
                    ? "Keep the job active until you receive enough quality applications."
                    : "Review applicants and consider reopening if needed."}

                </p>

              </div>

            </div>

          </div>
                    {/* ==========================
                FOOTER
          ========================== */}

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-800 p-6 text-center">

            <h2 className="text-2xl font-bold text-white">

              AI Interview Platform

            </h2>

            <p className="mt-3 text-gray-400">

              Recruiter Job Details • Manage and review job information efficiently.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ViewJob;