import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function RecruiterLogin() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

      const res = await axios.post(

        "http://localhost:5000/api/recruiter/login",

        formData

      );

      localStorage.setItem(

        "recruiterToken",

        res.data.token

      );

      localStorage.setItem(

        "recruiter",

        JSON.stringify(res.data.recruiter)

      );

      toast.success("Recruiter Login Successful");

      navigate("/recruiter/dashboard");

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Login Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-10 shadow-2xl">

        <h1 className="text-center text-4xl font-bold text-white">

          Recruiter Login

        </h1>

        <p className="mt-4 text-center text-gray-400">

          Login to manage candidates.

        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"

            value={formData.email}

            onChange={handleChange}

            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"

            value={formData.password}

            onChange={handleChange}

            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-blue-500"
          />
                    <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        <div className="mt-8 border-t border-slate-700 pt-6">

          <p className="text-center text-gray-400">

            Don't have a recruiter account?

          </p>

          <Link
            to="/recruiter/signup"
            className="mt-4 block w-full rounded-xl border border-blue-500 py-3 text-center font-semibold text-blue-400 transition hover:bg-blue-600 hover:text-white"
          >
            Recruiter Sign Up
          </Link>

        </div>

      </div>

    </div>

  );
}

export default RecruiterLogin;