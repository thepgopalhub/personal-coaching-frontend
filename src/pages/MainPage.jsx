import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function MainPage() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [videos, setVideos] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleFetchVideos = async () => {
    if (!className || !subject) {
      alert("Please enter both class and subject.");
      return;
    }

    try {
      const response = await fetch(
        `https://personal-coaching-backend.onrender.com/api/videos?className=${className}&subject=${subject.toLowerCase()}`
      );
      const data = await response.json();
      console.log(data);
      setVideos(data);

      setHasSearched(true);
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert("Failed to fetch videos");
    }
  };

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
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 mb-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold">Samvaad Learning App</h1>
        <div>
          <Link to="/upload" className="mr-4 font-semibold text-blue-500">
            Upload Video
          </Link>
          <button onClick={handleLogout} className="font-semibold text-red-500">
            Logout
          </button>
        </div>
      </nav>

      {/* Search Section */}
      <div className="p-6 mb-6 bg-white rounded shadow">
        <input
          type="text"
          placeholder="Class (e.g. 10)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="p-2 mr-2 border rounded"
        />
        <input
          type="text"
          placeholder="Subject (e.g. Math)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-2 mr-2 border rounded"
        />
        <button
          onClick={handleFetchVideos}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Enter
        </button>
      </div>

      {/* Video List */}
      <div className="space-y-4">
        {videos.length > 0 ? (
          videos.map((vid) => (
            <div
              key={vid._id}
              className="bg-white rounded-2xl shadow-lg p-4 max-w-2xl mx-auto w-full"
            >
              <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800">
                {vid.title}
              </h3>
              <div className="w-full aspect-video rounded-lg overflow-hidden">
                <video className="w-full h-full object-cover" controls>
                  <source src={vid.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleLike(vid._id)}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
                >
                  <span>👍</span>
                  <span>{vid.liked ? "Unlike" : "Like"}</span>
                  <span>({vid.likes?.length || 0})</span>
                </button>
              </div>

              <div className="comments-section mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  💬 Comments
                </h4>
                {Array.isArray(vid.comments) ? (
                  vid.comments.length > 0 ? (
                    <ul>
                      {vid.comments.map((comment) => (
                        <li key={comment._id || Math.random()}>
                          <strong className="text-gray-800">
                            {comment?.user?.name || "Unknown"}:
                          </strong>{" "}
                          {comment?.text || ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet</p>
                  )
                ) : (
                  <p>No comments available</p>
                )}
              </div>

              <div className="add-comment flex gap-2 mt-4">
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
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => handleAddComment(vid._id)}
                  disabled={!newComments[vid._id]}
                  className={`px-4 py-2 rounded-lg text-white transition 
        ${
          newComments[vid._id]
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
                >
                  Post
                </button>
              </div>
            </div>
          ))
        ) : hasSearched ? (
          <p>No videos found. Enter valid class & subject.</p>
        ) : null}
      </div>
    </div>
  );
}

export default MainPage;
