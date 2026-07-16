import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { recruiterSignup } from "../../services/recruiterService";

function RecruiterSignup() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({

    companyName: "",

    recruiterName: "",

    email: "",

    password: "",

    companyWebsite: "",

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

      const res = await recruiterSignup(formData);

      localStorage.setItem(
        "recruiterToken",
        res.data.token
      );

      localStorage.setItem(
        "recruiter",
        JSON.stringify(res.data.recruiter)
      );

      toast.success(
        "Recruiter account created successfully."
      );

      navigate("/recruiter/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Signup failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-lg rounded-3xl bg-slate-900 p-10 shadow-2xl">

        <h1 className="text-center text-4xl font-bold text-white">

          Recruiter Sign Up

        </h1>

        <p className="mt-3 text-center text-gray-400">

          Create your recruiter account.

        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white"
          />

          <input
            type="text"
            name="recruiterName"
            placeholder="Recruiter Name"
            value={formData.recruiterName}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Company Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white"
          />

          <input
            type="text"
            name="companyWebsite"
            placeholder="Company Website"
            value={formData.companyWebsite}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white"
          />
                    <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Recruiter Account"}
          </button>

        </form>

        <div className="mt-8 border-t border-slate-700 pt-6">

          <p className="text-center text-gray-400">

            Already have a recruiter account?

          </p>

          <Link
            to="/recruiter/login"
            className="mt-4 block w-full rounded-xl border border-blue-500 py-3 text-center font-semibold text-blue-400 transition hover:bg-blue-600 hover:text-white"
          >
            Login Here
          </Link>

        </div>

      </div>

    </div>

  );
}

export default RecruiterSignup;