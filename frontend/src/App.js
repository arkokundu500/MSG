import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect to /chat if logged in */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/chat" replace /> : <Home />}
        />
        {/* Protect the /chat route */}
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;