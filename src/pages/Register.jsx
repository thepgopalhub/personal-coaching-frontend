import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://personal-coaching-backend.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered Successfully");
      navigate("/");
    } else {
      alert(data.msg || "Registration failed");
    }
    }
    catch (err) {
      alert("Something went wrong. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-80">
        <h2 className="mb-4 text-2xl font-bold text-center">Register</h2>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} autoComplete="off" className="w-full p-2 mb-3 border rounded" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="new-password" className="w-full p-2 mb-4 border rounded" />
        <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded">Register</button>
        <p className="text-sm">Do you have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
