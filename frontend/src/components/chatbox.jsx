import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../sockets/socket';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/slices/chatSlice.js';
import api from '../utils/api.js';

export default function ChatBox({ classroomId }) {
  const dispatch = useDispatch();
  const messages = useSelector(s => s.chat.messages);
  const user = useSelector(s => s.auth.user);
  const [text, setText] = useState('');
  const boxRef = useRef();

  useEffect(() => {
    if (!classroomId) return;
    // register user room for private messages
    socket.emit('registerUserRoom');
    socket.emit('joinRoom', classroomId);

    socket.on('chatMessage', (msg) => {
      dispatch(addMessage(msg));
    });

    socket.on('privateMessage', (msg) => {
      dispatch(addMessage(msg));
    });

    // load recent messages from server
    (async () => {
      try {
        const res = await api.get(`/api/messages/classroom/${classroomId}`);
        dispatch(addMessage({ system: true, content: `Loaded ${res.data.length} messages` }));
        // replace with actual messages
        dispatch({ type: 'chat/setMessages', payload: res.data });
      } catch { /* ignore */ }
    })();

    return () => {
      socket.emit('leaveRoom', classroomId);
      socket.off('chatMessage');
      socket.off('privateMessage');
    };
  }, [classroomId, dispatch]);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit('chatMessage', { classroomId, content: text });
    setText('');
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col h-[520px]">
      <div className="font-semibold mb-2">Class Chat</div>
      <div ref={boxRef} className="flex-1 overflow-y-auto border rounded p-2 space-y-2">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className={`${m.sender?.id === user?._id ? 'text-right' : 'text-left'}`}>
            <div className="text-xs text-gray-500">{m.sender?.name || (m.system ? 'System' : 'Anon')}</div>
            <div className="bg-gray-100 inline-block p-2 rounded">{m.content}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Type message..." />
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
