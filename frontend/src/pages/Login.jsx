import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { loading, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  React.useEffect(() => {
    if (user) nav(`/${user.role}`);
  }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result?.payload) {
      nav(`/${result.payload.role}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">{loading ? '...' : 'Login'}</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
    </div>
  );
}
