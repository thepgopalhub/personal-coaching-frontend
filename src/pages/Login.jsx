import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";


function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ username: "", password: "" });
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://personal-coaching-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
    const fullUser = {
    ...data.user,
    token: data.token,
  };

  localStorage.setItem("user", JSON.stringify(fullUser)); 
  navigate("/main");
}
 else {
    alert(data.msg || "Login failed");
  }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-80">
        <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} autoComplete="off" className="w-full p-2 mb-3 border rounded" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="new-password"  className="w-full p-2 mb-4 border rounded" />
        <button type="submit" className="w-full py-2 text-white bg-green-500 rounded">Login</button>
        <p className="text-sm">Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
