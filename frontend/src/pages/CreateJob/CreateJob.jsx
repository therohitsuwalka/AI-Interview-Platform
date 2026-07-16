import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { createJob } from "../../services/jobService";

function CreateJob() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({

    jobTitle: "",

    company: "",

    location: "",

    jobType: "Full Time",

    experience: "Fresher",

    salary: "",

    skills: "",

    description: "",

    expiresAt: "",

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {

        ...formData,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

      };

      const res = await createJob(payload);

      toast.success(res.data.message);

      navigate("/recruiter/dashboard");

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Failed to create job."

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950">

      <div className="mx-auto max-w-5xl px-8 py-10">

        <h1 className="mb-2 text-4xl font-bold text-white">

          Create New Job

        </h1>

        <p className="mb-10 text-gray-400">

          Publish a new opening for candidates.

        </p>

        <form

          onSubmit={handleSubmit}

          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8"
        >
                      {/* ==========================
                Basic Information
          ========================== */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">

                Job Title

              </label>

              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Frontend Developer"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">

                Company Name

              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Google"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">

                Location

              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Jaipur / Remote"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">

                Job Type

              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              >

                <option>Full Time</option>

                <option>Internship</option>

                <option>Part Time</option>

                <option>Contract</option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">

                Experience

              </label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              >

                <option>Fresher</option>

                <option>0-1 Years</option>

                <option>1-3 Years</option>

                <option>3-5 Years</option>

                <option>5+ Years</option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">

                Salary

              </label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="₹6 LPA"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

          </div>
                    {/* ==========================
                Skills & Description
          ========================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">

              Required Skills

            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Express"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-sm text-gray-500">

              Separate multiple skills with commas (,)

            </p>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">

              Job Description

            </label>

            <textarea
              rows={8}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the responsibilities, required qualifications, benefits, hiring process, etc."
              required
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">

              Application Deadline

            </label>

            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>
                    {/* ==========================
                Live Job Preview
          ========================== */}

          <div className="rounded-2xl border border-slate-800 bg-slate-800 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">

              Live Job Preview

            </h2>

            <div className="space-y-4">

              <div>

                <p className="text-sm text-gray-400">

                  Job Title

                </p>

                <h3 className="text-2xl font-bold text-white">

                  {formData.jobTitle || "Frontend Developer"}

                </h3>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <p className="text-sm text-gray-400">

                    Company

                  </p>

                  <p className="text-lg text-white">

                    {formData.company || "Company Name"}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">

                    Location

                  </p>

                  <p className="text-lg text-white">

                    {formData.location || "Remote"}

                  </p>

                </div>

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <div>

                  <p className="text-sm text-gray-400">

                    Job Type

                  </p>

                  <p className="text-white">

                    {formData.jobType}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">

                    Experience

                  </p>

                  <p className="text-white">

                    {formData.experience}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">

                    Salary

                  </p>

                  <p className="text-green-400 font-semibold">

                    {formData.salary || "Not Disclosed"}

                  </p>

                </div>

              </div>

              <div>

                <p className="text-sm text-gray-400 mb-2">

                  Required Skills

                </p>

                <div className="flex flex-wrap gap-2">

                  {(formData.skills
                    ? formData.skills.split(",")
                    : ["React", "Node.js", "MongoDB"]
                  ).map((skill, index) => (

                    <span
                      key={index}
                      className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                    >

                      {skill.trim()}

                    </span>

                  ))}

                </div>

              </div>

              <div>

                <p className="text-sm text-gray-400 mb-2">

                  Description

                </p>

                <div className="rounded-xl bg-slate-900 p-4">

                  <p className="leading-7 text-gray-300 whitespace-pre-wrap">

                    {formData.description ||

                      "Job description will appear here..."}

                  </p>

                </div>

              </div>

            </div>

          </div>
                    {/* ==========================
                Action Buttons
          ========================== */}

          <div className="flex flex-col gap-4 pt-4 md:flex-row">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Job..."
                : "Create Job"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/recruiter/dashboard")
              }
              className="flex-1 rounded-xl border border-slate-600 px-6 py-4 font-semibold text-gray-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default CreateJob;