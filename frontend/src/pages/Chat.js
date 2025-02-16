import React, { useEffect, useState } from 'react';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      const receivedMessage = event.data; // Message echoed by the server
      setMessages((prev) => [...prev, { text: receivedMessage, type: 'received' }]);
    };

    return () => socket.close(); // Close WebSocket on component unmount
  }, []);

  // Load chat history and username from local storage on component mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setMessages(savedMessages);

    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUsername(userData.username); // Set the username from local storage
    }
  }, []);

  // Save chat history to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Handle sending a message
  const sendMessage = () => {
    if (ws && input.trim()) {
      const timestamp = new Date().toLocaleTimeString(); // Add timestamp to the message
      const sentMessage = `[${timestamp}] You: ${input}`; // Format the sent message

      // Append the sent message to the chat window
      setMessages((prev) => [...prev, { text: sentMessage, type: 'sent' }]);

      // Send the message to the server via WebSocket
      ws.send(input);

      // Clear the input field
      setInput('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Clear authentication data from local storage
    navigate('/', { replace: true }); // Redirect to the home page without reloading
    navigate(0); // Reload the home page
  };

  return (
    <div className="chat-container">
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Chat Header */}
      <h1>{username ? `${username}'s Chat` : 'Chat'}</h1>

      {/* Chat Messages */}
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index} className={msg.type}>
            {msg.text}
          </p>
        ))}
      </div>

      {/* Input Field */}
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