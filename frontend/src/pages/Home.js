
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-box">
        {isLogin ? (
          <>
            <LoginForm onLogin={() => setIsLogin(false)} />
            {/* Switch to Signup Button */}
            <button className="switch-button" onClick={() => setIsLogin(false)}>
              Switch to Signup
            </button>
          </>
        ) : (
          <>
            <SignupForm onSignup={() => setIsLogin(true)} />
            {/* Switch to Login Button */}
            <button className="switch-button" onClick={() => setIsLogin(true)}>
              Switch to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;