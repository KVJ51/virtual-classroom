import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (result?.payload) {
      nav(`/${result.payload.role}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <select className="w-full border px-3 py-2 rounded" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Create account</button>
      </form>
    </div>
  );
}
