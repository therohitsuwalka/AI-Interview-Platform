import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/profileService";

function Profile() {
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [user, setUser] = useState({});

  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
  });

  const [editData, setEditData] = useState({
    name: "",
    resume: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      setUser(res.data.user);

      setStats(res.data.stats);

      setEditData({
        name: res.data.user.name || "",
        resume: res.data.user.resume || "",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const res = await updateProfile(editData);

      setUser(res.data.user);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile Update Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image.");

      return;
    }

    try {
      setUploadingImage(true);

      const res = await uploadProfileImage(selectedImage);

      setUser(res.data.user);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setPreview("");

      setSelectedImage(null);

      toast.success("Profile image uploaded successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-slate-900 p-10 shadow-2xl">
          {/* ==========================
              Profile Header
          ========================== */}

          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex flex-col items-center">
              <img
                src={
                  preview ||
                  user.profileImage ||
                  `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(
                    user.name || "User",
                  )}`
                }
                alt="Profile"
                className="h-44 w-44 rounded-full border-4 border-blue-500 object-cover shadow-xl"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-6 block w-full text-sm text-white
                  file:mr-4
                  file:rounded-lg
                  file:border-0
                  file:bg-blue-600
                  file:px-4
                  file:py-2
                  file:text-white
                  hover:file:bg-blue-700"
              />

              <button
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="mt-5 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {uploadingImage ? "Uploading..." : "Upload Profile Image"}
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white">{user.name}</h1>

              <p className="mt-4 text-lg text-gray-400">{user.email}</p>

              <span className="mt-5 inline-block rounded-full bg-blue-600 px-5 py-2 text-white capitalize">
                {user.role}
              </span>
            </div>
          </div>

          {/* ==========================
              Statistics
          ========================== */}

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-800 p-6 text-center">
              <h3 className="text-gray-400">Total Interviews</h3>

              <p className="mt-4 text-5xl font-bold text-cyan-400">
                {stats.totalInterviews}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-6 text-center">
              <h3 className="text-gray-400">Average Score</h3>

              <p className="mt-4 text-5xl font-bold text-green-400">
                {stats.averageScore}%
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-6 text-center">
              <h3 className="text-gray-400">Best Score</h3>

              <p className="mt-4 text-5xl font-bold text-yellow-400">
                {stats.bestScore}%
              </p>
            </div>
          </div>

          {/* ==========================
              Edit Profile
          ========================== */}

          <div className="mt-12 rounded-2xl bg-slate-800 p-8">
            <h2 className="mb-8 text-3xl font-bold text-white">Edit Profile</h2>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-gray-300 font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-300 font-medium">
                  Resume (PDF / DOC / DOCX)
                </label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      resume: e.target.files[0],
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-white"
                />

                {user.resume && (
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-blue-400 hover:underline"
                  >
                    📄 View Current Resume
                  </a>
                )}
              </div>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>

          {/* ==========================
              Account Information
          ========================== */}

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-800 p-8">
              <h2 className="text-2xl font-bold text-white">
                Account Information
              </h2>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>

                  <p className="mt-2 text-lg text-white">{user.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email Address</p>

                  <p className="mt-2 text-lg text-white">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Account Role</p>

                  <p className="mt-2 text-lg capitalize text-green-400">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-800 p-8">
              <h2 className="text-2xl font-bold text-white">
                Performance Overview
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Interviews</span>

                  <span className="font-bold text-cyan-400">
                    {stats.totalInterviews}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Average Score</span>

                  <span className="font-bold text-green-400">
                    {stats.averageScore}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Best Score</span>

                  <span className="font-bold text-yellow-400">
                    {stats.bestScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* ==========================
              Profile Summary
          ========================== */}

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-800 p-8">
              <h2 className="text-2xl font-bold text-white">Profile Summary</h2>

              <p className="mt-5 leading-8 text-gray-400">
                Keep your profile updated to improve your interview experience.
                Your profile information is used by the AI Resume ATS, AI
                Interview Engine, Dashboard, Recruiter Panel and Interview
                Reports.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name</span>

                  <span className="font-semibold text-white">{user.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>

                  <span className="text-white">{user.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Role</span>

                  <span className="capitalize text-blue-400">{user.role}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Resume</span>

                  <span className="text-green-400">
                    {user.resume ? "Uploaded" : "Not Uploaded"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8">
              <h2 className="text-3xl font-bold text-white">
                AI Career Progress
              </h2>

              <p className="mt-5 leading-8 text-blue-100">
                Continue practicing interviews regularly. Every completed
                interview improves your communication, technical knowledge,
                confidence and overall AI score.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-5">
                <div className="rounded-xl bg-white/10 p-5">
                  <h3 className="text-white">Interviews</h3>

                  <p className="mt-3 text-4xl font-bold text-white">
                    {stats.totalInterviews}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-5">
                  <h3 className="text-white">Best Score</h3>

                  <p className="mt-3 text-4xl font-bold text-white">
                    {stats.bestScore}%
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-white/10 p-5">
                <h3 className="text-xl font-semibold text-white">
                  AI Recommendation
                </h3>

                <p className="mt-3 leading-7 text-blue-100">
                  Keep practicing interviews consistently. Upload your latest
                  resume before every interview and review AI feedback after
                  each session to improve faster.
                </p>
              </div>
            </div>
          </div>
          {/* ==========================
              Quick Actions
          ========================== */}

          <div className="mt-10">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Quick Actions
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 transition hover:border-blue-500">
                <div className="text-5xl">📄</div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  Resume ATS
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Upload your latest resume and get an AI-powered ATS score with
                  detailed improvement suggestions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 transition hover:border-green-500">
                <div className="text-5xl">🎤</div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  AI Interview
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Practice real interview questions and receive detailed AI
                  evaluation with communication and technical scores.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 transition hover:border-purple-500">
                <div className="text-5xl">💻</div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  Coding Round
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Solve coding problems, improve problem solving skills and
                  prepare for technical interviews.
                </p>
              </div>
            </div>
          </div>

          {/* ==========================
              Account Status
          ========================== */}

          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-800 p-8">
            <h2 className="text-2xl font-bold text-white">Account Status</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-gray-400">Profile</p>

                <p className="mt-2 font-semibold text-green-400">Completed</p>
              </div>

              <div>
                <p className="text-gray-400">Resume</p>

                <p className="mt-2 font-semibold text-green-400">
                  {user.resume ? "Uploaded" : "Not Uploaded"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Interviews</p>

                <p className="mt-2 font-semibold text-cyan-400">
                  {stats.totalInterviews}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Best Score</p>

                <p className="mt-2 font-semibold text-yellow-400">
                  {stats.bestScore}%
                </p>
              </div>
            </div>
          </div>
          {/* ==========================
              Footer
          ========================== */}

          <div className="mt-12 border-t border-slate-700 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-bold text-white">
                  AI Interview Platform
                </h3>

                <p className="mt-2 text-gray-400">
                  Practice • Improve • Get Hired 🚀
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-400">Logged in as</p>

                <p className="mt-1 font-semibold text-white">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-6">
              <p className="text-center text-sm text-gray-500">
                © 2026 AI Interview Platform. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
