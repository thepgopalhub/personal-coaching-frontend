import { useEffect, useState } from "react";
import axios from "axios";
import useDarkMode from "../hooks/useDarkMode";
import Loader from "../components/Loader";

const AssignmentList = () => {
  useDarkMode();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const res = await axios.get(
          "https://personal-coaching-backend.onrender.com/api/assignments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl p-6 mx-auto bg-white shadow-lg rounded-2xl dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Submitted Assignments
        </h2>

        {assignments.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No assignments submitted yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {assignments.map((a) => (
              <li
                key={a._id}
                className="p-4 border shadow-sm rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              >
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Name:</strong> {a.name}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Class:</strong> {a.className}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Subject:</strong> {a.subject}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Email:</strong> {a.email}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  {/* View PDF */}
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(a.fileUrl)}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-green-600 hover:underline"
                  >
                    👁️ View PDF
                  </a>

                  {/* Download PDF */}
                  <a
                    href={a.fileUrl}
                    download
                    className="text-sm font-medium text-blue-500 hover:underline"
                  >
                    📥 Download PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
