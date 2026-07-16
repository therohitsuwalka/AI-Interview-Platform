import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "../../services/authService";

function ResetPassword() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const otp = location.state?.otp || "";

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {

      toast.error("Passwords do not match.");

      return;

    }

    try {

      setLoading(true);

      await resetPassword({
        email,
        otp,
        password: formData.password,
      });

      toast.success("Password reset successfully.");

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Password reset failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-10 shadow-2xl">

        <h1 className="text-center text-4xl font-bold text-white">
          Reset Password
        </h1>

        <p className="mt-4 text-center text-gray-400">
          Create a new password for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>

        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full text-center text-blue-400 hover:text-blue-300"
        >
          ← Back to Login
        </button>

      </div>

    </div>

  );

}

export default ResetPassword;