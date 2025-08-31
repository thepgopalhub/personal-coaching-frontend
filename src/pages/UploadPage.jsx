import { useState } from "react";
import Loader from "../components/Loader";
import useDarkMode from "../hooks/useDarkMode";
import { notifySuccess, notifyError } from "../utils/notify";

function UploadPage() {
  const [theme] = useDarkMode();
  const [videoData, setVideoData] = useState({
    title: "",
    className: "",
    subject: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const role = storedUser?.user?.role;

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!storedUser || role !== "admin") {
      notifyError("Only admins can upload videos.");
      setLoading(false);
      return;
    }

    if (!file || !videoData.title || !videoData.className || !videoData.subject) {
      notifyError("Please fill in all fields and choose a video.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("className", videoData.className);
    formData.append("subject", videoData.subject.toLowerCase());
    formData.append("video", file);

    try {
      const res = await fetch("https://personal-coaching-backend.onrender.com/api/videos/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        notifyError(errText || "Upload failed");
      }

      const data = await res.json();
      notifySuccess(data.message || "Upload successful ✅");
    } catch (err) {
      console.error("❌ Upload error:", err);
      notifyError("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {loading ? (
        <p className="font-semibold text-blue-500">Uploading video...</p>
      ) : (
        <form
          onSubmit={handleUpload}
          className="max-w-md p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-800"
        >
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className="block w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
          <input
            name="className"
            placeholder="Class (e.g. 10)"
            onChange={handleChange}
            className="block w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
          <input
            name="subject"
            placeholder="Subject (e.g. Math)"
            onChange={handleChange}
            className="block w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block mb-4 text-gray-700 dark:text-gray-300"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
          >
            Upload Video
          </button>
        </form>
      )}
    </div>
  );
}

export default UploadPage;
