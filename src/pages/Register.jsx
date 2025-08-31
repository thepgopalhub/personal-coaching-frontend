import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ name: "", username: "", email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Frontend Validation
    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.error("All fields are required ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://personal-coaching-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful 🎉");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(data.msg || "Registration failed ❌");
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
    {loading && <Loader overlay />}

    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white shadow-md dark:bg-gray-800 rounded-2xl w-80"
    >
      <h2 className="mb-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
        Register
      </h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
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
        className="w-full py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading} 
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  </div>
);

}

export default Register;
