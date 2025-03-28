// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/App.css';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  
  const handleLogin = () => {
    // Add your authentication logic here
    if (username === 'user' && password === 'password') {
      setIsAuthenticated(true);
      navigate('/platform'); // Redirect to platform on successful login
    } else {
      alert('Invalid username or password');
    }
  };
  

/*
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store the token in localStorage (or sessionStorage) after successful login
        sessionStorage.setItem('token', data.token); 

        // Set authenticated state
        setIsAuthenticated(true);

        // Redirect to the platform page
        navigate('/platform');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('There was an error connecting to the backend');
    }
  };

*/



  return (
    <div className="login">
      <h2>Login </h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="login-container">
        <div >
          <input className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      
        <div >
          <input className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
          <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
