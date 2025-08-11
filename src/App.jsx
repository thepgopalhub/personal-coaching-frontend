import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPage from "./pages/UploadPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                
            </Routes>
        </Router>
    );
}

export default App;