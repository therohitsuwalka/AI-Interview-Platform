import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signupUser } from "../../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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

      await signupUser(formData);

      // Old login remove
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Account Created Successfully 🎉");

      navigate("/login", { replace: true });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Signup Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-[400px]"
      >

        <h1 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border w-full p-3 rounded-lg mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border w-full p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="border w-full p-3 rounded-lg mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-3 rounded-lg"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-2"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Signup;