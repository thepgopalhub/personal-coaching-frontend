import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ username: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Frontend Validation
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error("Username and Password are required ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://personal-coaching-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: data.token,
            user: data.user,
          })
        );

        toast.success("Login successful 🎉");
        setTimeout(() => navigate("/main"), 1500);
      } else {
        toast.error(data.msg || "Login failed ❌");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {loading && <Loader overlay />} {/* 🔹 Fullscreen loader */}

      <form
        onSubmit={handleSubmit}
        className="relative z-10 p-8 bg-white shadow-md dark:bg-gray-800 rounded-2xl w-80"
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="off"
          className="w-full p-2 mb-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading} // 🔹 prevents double clicks
          className={`w-full py-2 text-white rounded transition ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
