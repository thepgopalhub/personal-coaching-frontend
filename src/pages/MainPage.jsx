import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import useDarkMode from "../hooks/useDarkMode";

function MainPage() {
  const [theme, setTheme] = useDarkMode();
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComments, setNewComments] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleFetchVideos = async () => {
    if (!className || !subject) {
      alert("Please enter both class and subject.");
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const queryParams = new URLSearchParams();
      if (className.trim()) queryParams.append("className", className.trim());
      if (subject.trim())
        queryParams.append("subject", subject.trim().toLowerCase());

      const response = await fetch(
        `https://personal-coaching-backend.onrender.com/api/videos?${queryParams.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = await response.json();
      setVideos(data);
      setHasSearched(true);
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const res = await axios.get(
          "https://personal-coaching-backend.onrender.com/api/videos",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching latest videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleLike = async (videoId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) {
        alert("Please login to like videos");
        return;
      }

      const res = await axios.post(
        `https://personal-coaching-backend.onrender.com/api/videos/${videoId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the specific video in state
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId
            ? { ...v, likesCount: res.data.likesCount, liked: res.data.liked }
            : v
        )
      );
      console.log(res.data);
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  const handleAddComment = async (videoId) => {
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : null;

      if (!token) {
        alert("You must be logged in to comment.");
        return;
      }

      const text = newComments[videoId];
      if (!text || text.trim() === "") {
        alert("Comment cannot be empty.");
        return;
      }

      const res = await axios.post(
        `https://personal-coaching-backend.onrender.com/api/videos/${videoId}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Update local state with new comments
      setVideos((prevVideos) =>
        prevVideos.map((v) =>
          v._id === videoId ? { ...v, comments: res.data.comment } : v
        )
      );

      // Clear input box
      setNewComments({ ...newComments, [videoId]: "" });
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="flex flex-col items-center justify-between gap-4 p-4 mb-6 bg-white rounded shadow sm:flex-row dark:bg-gray-800">
        <h1 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 sm:text-left">
          Samvaad Learning App
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {(() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.user?.role === "admin") {
              return (
                <Link to="/upload" className="mr-4 font-semibold text-blue-500">
                  Upload Video
                </Link>
              );
            } else {
              return (
                <button
                  onClick={() => alert("Only admins can upload videos!")}
                  className="mr-4 font-semibold text-gray-400 cursor-not-allowed"
                >
                  Upload Video
                </button>
              );
            }
          })()}

          {/* 🌙 Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <button onClick={handleLogout} className="font-semibold text-red-500">
            Logout
          </button>
        </div>
      </nav>

      {/* Search Section */}
      <div className="flex flex-col items-center justify-center gap-3 p-4 mb-6 bg-white rounded-lg shadow sm:flex-row dark:bg-gray-800">
        <input
          type="text"
          placeholder="Class (e.g. 10)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full p-2 mr-2 border rounded-lg sm:w-auto focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Subject (e.g. Math)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 mr-2 border rounded-lg sm:w-auto focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        <button
          onClick={handleFetchVideos}
          className="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
        >
          Enter
        </button>
      </div>

      {/* Video List */}
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {hasSearched ? "Search Results" : "Recently Uploaded"}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 col-span-full">
              <Loader />
            </div>
          ) : videos.length > 0 ? (
            videos.map((vid) => (
              <div
                key={vid._id}
                className="p-4 bg-white rounded-lg shadow dark:bg-gray-800"
              >
                <h3 className="mt-2 font-semibold text-gray-800 dark:text-gray-100">
                  {vid.title}
                </h3>

                <div className="w-full overflow-hidden rounded-lg aspect-video">
                  <video className="object-cover w-full h-full" controls>
                    <source src={vid.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Like button */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => handleLike(vid._id)}
                    className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-white transition bg-blue-500 rounded sm:w-auto hover:bg-blue-600"
                  >
                    <span>👍</span>
                    <span>{vid.liked ? "Unlike" : "Like"}</span>
                    <span>({vid.likesCount || 0})</span>
                  </button>
                </div>

                {/* Comments */}
                <div className="mt-4 comments-section">
                  <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-200 text-md">
                    💬 Comments
                  </h4>
                  {Array.isArray(vid.comments) && vid.comments.length > 0 ? (
                    <ul className="space-y-1 break-words">
                      {vid.comments.map((comment) => (
                        <li key={comment._id || Math.random()}>
                          <strong className="text-gray-800 dark:text-gray-100">
                            {comment?.user?.name || "Unknown"}:
                          </strong>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {comment?.text || ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No comments yet
                    </p>
                  )}
                </div>

                {/* Add comment */}
                <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-center add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComments[vid._id] || ""}
                    onChange={(e) =>
                      setNewComments({
                        ...newComments,
                        [vid._id]: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-500"
                  />
                  <button
                    onClick={() => handleAddComment(vid._id)}
                    disabled={!newComments[vid._id]}
                    className={`px-4 py-2 rounded-lg text-white transition w-full sm:w-auto
                ${
                  newComments[vid._id]
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No videos available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
