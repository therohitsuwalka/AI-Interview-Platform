import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  verifyOtp,
  forgotPassword,
} from "../../services/authService";

function VerifyOtp() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {

    e.preventDefault();

    if (!otp) {

      toast.error("Please enter OTP.");

      return;

    }

    try {

      setLoading(true);

      await verifyOtp({
        email,
        otp,
      });

      toast.success("OTP Verified");

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "OTP Verification Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  const resendOtp = async () => {

    try {

      setResending(true);

      await forgotPassword(email);

      toast.success("OTP Sent Again");

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Failed to resend OTP"

      );

    } finally {

      setResending(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-6">

      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-10 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center">

          Verify OTP

        </h1>

        <p className="text-gray-400 text-center mt-4">

          Enter the OTP sent to

        </p>

        <p className="text-blue-400 text-center font-semibold">

          {email}

        </p>

        <form
          onSubmit={handleVerify}
          className="mt-8 space-y-6"
        >

          <input
            type="text"
            placeholder="Enter 6 Digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-center tracking-[10px] text-2xl text-white outline-none focus:border-blue-500"
            maxLength={6}
          />
                    <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={resendOtp}
          disabled={resending}
          className="mt-6 w-full text-center text-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </button>

        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-4 w-full text-center text-gray-400 hover:text-white"
        >
          ← Back
        </button>

      </div>

    </div>

  );
}

export default VerifyOtp;