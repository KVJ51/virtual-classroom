import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutLocal } from '../redux/slices/authSlice.js';
import api from '../utils/api.js';

export default function Navbar() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch { /* ignore */ }
    dispatch(logoutLocal());
    nav('/login');
  };

  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="font-semibold text-lg">Virtual Classroom</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden md:inline">{user.name} • {user.role}</span>
            <Link to={`/${user.role}`} className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
            <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
            <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
