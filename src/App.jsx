import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPage from "./pages/UploadPage";
import SubmitAssignment from "./pages/SubmitAssignment";
import AssignmentList from "./pages/AssignmentList";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <Router>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                <Route path="/submit-assignment" element={<SubmitAssignment />} />
                <Route path="/assignments" element={<AssignmentList />} />
            </Routes>
        </Router>
    );
}

export default App;