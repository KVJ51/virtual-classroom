import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DashboardTeacher from "./pages/DashboardTeacher.jsx";
import DashboardStudent from "./pages/DashboardStudent.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import ClassroomView from "./pages/ClassroomView.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/navbar.jsx";
import { useSelector } from 'react-redux';


export default function App() {
  const user = useSelector((s) => s.auth.user);

  return (
    <Router>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}`} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacher" element={<Protected role="teacher"><DashboardTeacher/></Protected>} />
          <Route path="/student" element={<Protected role="student"><DashboardStudent/></Protected>} />
          <Route path="/admin" element={<Protected role="admin"><DashboardAdmin/></Protected>} />
          <Route path="/classroom/:id" element={<Protected><ClassroomView/></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
// small Protected wrapper
function Protected({ children, role }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

