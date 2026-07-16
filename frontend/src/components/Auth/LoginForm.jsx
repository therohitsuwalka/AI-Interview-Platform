import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";

function LoginForm() {

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

      const res = await loginUser(formData);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Login Successful 🎉");

      navigate("/dashboard");

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

    <div className="flex justify-center items-center p-10">

      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-3">
          Login to continue your AI interview journey.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl transition disabled:opacity-60"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        <p className="mt-6 text-center text-gray-500">

          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 font-semibold ml-2"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>

  );

}

export default LoginForm;