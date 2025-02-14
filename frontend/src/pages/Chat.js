import React, { useEffect, useState } from 'react';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      const receivedMessage = event.data;
      setMessages((prev) => [...prev, { text: receivedMessage, type: 'received' }]);
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUsername(userData.username);
      const savedMessages = JSON.parse(localStorage.getItem(`chatHistory_${userData.username}`)) || [];
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      localStorage.setItem(`chatHistory_${userData.username}`, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = () => {
    if (ws && input.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      const sentMessage = `[${timestamp}] You: ${input}`;
      setMessages((prev) => [...prev, { text: sentMessage, type: 'sent' }]);
      ws.send(input);
      setInput('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    navigate(0);
  };

  return (
    <div className="chat-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1>{username ? `${username}'s Chat` : 'Chat'}</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index} className={msg.type}>
            {msg.text}
          </p>
        ))}
      </div>
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
