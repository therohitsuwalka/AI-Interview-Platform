import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email);

      toast.success("OTP sent successfully.");

      navigate("/verify-otp", {
        state: { email },
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">

      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-10 shadow-2xl">

        <h1 className="text-center text-4xl font-bold text-white">

          Forgot Password

        </h1>

        <p className="mt-4 text-center text-gray-400">

          Enter your registered email address.
          We'll send you an OTP.

        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-blue-500"
          />
                    <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
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

export default ForgotPassword;