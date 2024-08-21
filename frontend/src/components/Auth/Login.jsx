import React, { useState, useEffect } from 'react';
import '../../assets/css/login.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [eyePosition, setEyePosition] = useState({ left: 0, top: 0 });
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    setEyePosition({ left: x / 10, top: y / 10 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@example.com' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container" onMouseMove={handleMouseMove}>
      <div className="login-card">
        <div className="login-left">
          <div className="character">
            <img src="/path/to/character.png" alt="Character" />
            <div className="eyes" style={{ transform: `translate(${eyePosition.left}px, ${eyePosition.top}px)` }}>
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
          </div>
        </div>
        <div className="login-right">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email address</label>
              <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
