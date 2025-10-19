import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashboardTeacher() {
  const { user } = useSelector(s => s.auth);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // ideally an endpoint /api/classrooms?teacherId=...
        const res = await api.get('/api/classrooms');
        setClasses(res.data || []);
      } catch {
        setClasses([]);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Teacher Dashboard</h1>
      <p className="mb-4">Hello, {user?.name}. Manage your classes and quizzes here.</p>

      <div className="grid md:grid-cols-3 gap-4">
        {classes.length ? classes.map(c => (
          <div key={c._id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-500">Code: {c.code}</p>
            <div className="mt-3 space-x-2">
              <Link to={`/classroom/${c._id}`} className="inline-block bg-blue-600 text-white px-3 py-1 rounded">Open</Link>
            </div>
          </div>
        )) : <div className="col-span-3 p-4 bg-white rounded shadow">No classes found</div>}
      </div>
    </div>
  );
}
