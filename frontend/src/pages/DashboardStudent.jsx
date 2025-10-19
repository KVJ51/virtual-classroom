import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';

export default function DashboardStudent() {
  const { user } = useSelector(s => s.auth);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // trying to fetch classes - requires backend endpoint
        const res = await api.get('/api/classrooms'); // implement if not present
        setClasses(res.data || []);
      } catch {
        setClasses([]);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Student Dashboard</h1>
      <p className="mb-4">Welcome back, {user?.name}</p>

      <div className="grid md:grid-cols-3 gap-4">
        {classes.length ? classes.map(c => (
          <div key={c._id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-500">{c.subject}</p>
            <Link to={`/classroom/${c._id}`} className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 rounded">Open</Link>
          </div>
        )) : <div className="col-span-3 p-4 bg-white rounded shadow">No classes found (seed backend or implement GET /api/classrooms)</div>}
      </div>
    </div>
  );
}
