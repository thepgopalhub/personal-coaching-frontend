import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function MainPage() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [videos, setVideos] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // Fetch videos
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

  // Like / Unlike a video
  const handleLike = async (videoId) => {
    try {
      console.log("📌 handleLike called with:", videoId);
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      console.log("📌 LocalStorage user data:", token);
      if (!token) {
        alert("Please login to like videos");
        return;
      }

      console.log("📌 Sending request to:", `https://personal-coaching-backend.onrender.com/api/videos/${videoId}/like`);
      const res = await axios.post(
        `https://personal-coaching-backend.onrender.com/api/videos/${videoId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Like response:", res.data);

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
            <div key={vid._id} className="p-4 bg-white rounded shadow">
              <h3 className="mb-2 text-lg font-semibold">{vid.title}</h3>
              <video width="100%" height="315" controls>
                <source src={vid.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleLike(vid._id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  <span>👍</span>
                  <span>{vid.liked ? "Unlike" : "Like"}</span>
                  <span>({vid.likesCount || 0})</span>
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
