import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/chatbox.jsx';
import api from '../utils/api.js';

export default function ClassroomView() {
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/classrooms/${id}`);
        setClassroom(res.data);
      } catch {
        setClassroom(null);
      }
    })();
  }, [id]);

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{classroom?.name || 'Classroom'}</h2>
          <p className="text-sm text-gray-500 mb-4">Subject: {classroom?.subject}</p>
          <div className="mb-4">
            <h3 className="font-semibold">Materials</h3>
            <ul className="list-disc pl-5">
              {(classroom?.materials || []).map((m, idx) => (
                <li key={idx}><a href={m} className="text-blue-600" target="_blank">{m.split('/').pop()}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Quizzes</h3>
            <p className="text-sm text-gray-500">Quizzes list will appear here (implement GET /api/quizzes/:classroomId)</p>
          </div>
        </div>
      </div>

      <div>
        <ChatBox classroomId={id} />
      </div>
    </div>
  );
}
