import { useState } from "react";
import axios from "axios";

export default function SubmitAssignment() {
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    subject: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFile(e.target.files[0]);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("assignment", file);

      await axios.post(
        "https://personal-coaching-backend.onrender.com/api/assignments/submit",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage({ type: "success", text: "✅ Assignment submitted successfully!" });
      setFormData({ name: "", className: "", subject: "", email: "" });
      setFile(null);
    } catch (error) {
      setMessage({ type: "error", text: "❌ Failed to submit. Try again!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-950">
        <div className="w-full max-w-lg p-6 mx-4 bg-white shadow-lg dark:bg-gray-900 rounded-2xl">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
        Submit Assignment
      </h2>

      {/* Alert messages */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Class */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Class
          </label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
            placeholder="e.g. 10"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Enter subject"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload PDF
          </label>
          <input
            type="file"
            name="file"
            accept=".pdf"
            onChange={handleChange}
            required
            className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg dark:text-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300
            ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"}`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
    </div>
  );
}
