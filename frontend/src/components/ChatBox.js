import React, { useEffect, useState } from 'react';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState('');

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
    const savedMessages = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setMessages(savedMessages);

    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUsername(userData.username);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
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

  return (
    <div className="chat-container">
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

export default ChatBox;
