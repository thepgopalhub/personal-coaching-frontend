import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function MainPage() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [videos, setVideos] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleFetchVideos = async () => {
    if (!className || !subject) {
      alert("Please enter both class and subject.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/videos?className=${className}&subject=${subject.toLowerCase()}`
      );
      const data = await response.json();
      setVideos(data);
      setHasSearched(true);
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert("Failed to fetch videos");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <nav className="flex items-center justify-between p-4 mb-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold">Samvaad Learning App</h1>
        <div>
          <Link to="/upload" className="mr-4 font-semibold text-blue-500">Upload Video</Link>
          <button onClick={handleLogout} className="font-semibold text-red-500">Logout</button>
        </div>
      </nav>

      <div className="p-6 mb-6 bg-white rounded shadow">
        <input type="text" placeholder="Class (e.g. 10)" value={className} onChange={(e) => setClassName(e.target.value)} className="p-2 mr-2 border rounded" />
        <input type="text" placeholder="Subject (e.g. Math)" value={subject} onChange={(e) => setSubject(e.target.value)} className="p-2 mr-2 border rounded" />
        <button onClick={handleFetchVideos} className="px-4 py-2 text-white bg-blue-500 rounded">Enter</button>
      </div>

      <div className="space-y-4">
        {videos.length > 0 ? (
          videos.map((vid, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow">
              <h3 className="mb-2 text-lg font-semibold">{vid.title}</h3>
              <video width="100%" height="315" controls>
                <source src={vid.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

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
