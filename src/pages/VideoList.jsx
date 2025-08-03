import { useEffect, useState } from "react";
import axios from "axios";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("https://personal-coaching-backend.onrender.com/api/videos");
        setVideos(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch videos:", err);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Uploaded Videos</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {videos.map((video) => (
          <div key={video._id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{video.title}</h3>
            <p>Class: {video.className}</p>
            <p>Subject: {video.subject}</p>
            <video controls width="100%" className="mt-2">
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoList;
