import './styles/App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ConductQuiz from './ConductQuiz';
import AIChatbox from './AIChatbox';
import UserRegistration from './UserRegistration';
import AttendQuiz from './AttendQuiz';
import EvaluateQuiz from './EvaluateQuiz';
import ViewResult from './ViewResult';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFullName(decoded.fullName || ''); 
        setRole(decoded.role || '');
      } catch (err) {
        console.error('Token decoding failed', err);
      }
    }
  }, [token]);

  if (token) {
    const decoded = jwtDecode(token);    
    console.log(token);
    console.log(decoded.username);   
    console.log(decoded.fullName);   
    console.log(decoded.role);       
  }

  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    navigate('/');
  }

  return (
    <div className="App full-width-container">
      <div className="logout-button-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="content-container">
        {/* Sidebar with 6 always-visible features */}
        <div className="sidebar">
          <div
            className={`sidebar-button ${selectedOption === null ? 'active' : ''}`}
            onClick={() => setSelectedOption(null)}
          >
            🏠 Home
          </div>
          {role === 'teacher' ? (
          <div
            className={`sidebar-button ${selectedOption === 'userRegistration' ? 'active' : ''}`}
            onClick={() => handleMenuClick('userRegistration')}
          >
            👤 User Management
          </div>
          ) : null}
          {role === 'teacher' ? (
          <div
            className={`sidebar-button ${selectedOption === 'conductQuiz' ? 'active' : ''}`}
            onClick={() => handleMenuClick('conductQuiz')}
          >
            📚 Conduct Quiz
          </div>
          ) : null}
          {role === 'student' || role === 'teacher' ? (
          <div
            className={`sidebar-button ${selectedOption === 'attendQuiz' ? 'active' : ''}`}
            onClick={() => handleMenuClick('attendQuiz')}
          >
            📝 Attend Quiz
          </div>
          ) : null}
          {role === 'teacher' ? (
          <div
            className={`sidebar-button ${selectedOption === 'evaluateQuiz' ? 'active' : ''}`}
            onClick={() => handleMenuClick('evaluateQuiz')}
          >
            ✅ Evaluate Quiz
          </div>
          ) : null}
          {role === 'student' || role === 'teacher' ? (
          <div
            className={`sidebar-button ${selectedOption === 'chatbox' ? 'active' : ''}`}
            onClick={() => handleMenuClick('chatbox')}
          >
            🤖 AI Tutoring
          </div>
          ) : null}
          {role === 'student' || role === 'teacher' || role === 'parent' ? (
          <div
            className={`sidebar-button ${selectedOption === 'viewResult' ? 'active' : ''}`}
            onClick={() => handleMenuClick('viewResult')}
          >
            📊 View Result
          </div>
          ) : null}
        </div>

        {/* Main Content Area */}
        <div className="main-content animated-content">
          {!selectedOption && (
            <div className="welcome-section">
              <div className="welcome-content">
                <img
                  src="https://mymathsclub.com/wp-content/uploads/2023/11/25bd5245-f586-4091-8fbd-acacc4174a9e_1-1024x675.webp"
                  alt="Math Tutoring Illustration"
                  className="welcome-image"
                />
                <h1 className="welcome-title">Hello <span className="highlight-name">{fullName || 'user'}</span>! Welcome to</h1>
                <h2 className="platform-name">
                  The Collaborative Intelligence Mathematics Tutoring Service Platform!
                </h2>
                <p className="welcome-subtitle">Choose a function from the left menu to get started.</p>
              </div>
            </div>
          )}

          {selectedOption === 'userRegistration' && <UserRegistration />}
          {selectedOption === 'conductQuiz' && <ConductQuiz />}
          {selectedOption === 'attendQuiz' && <AttendQuiz />}
          {selectedOption === 'evaluateQuiz' && <EvaluateQuiz />}
          {selectedOption === 'chatbox' && <AIChatbox />}
          {selectedOption === 'viewResult' && <ViewResult />}
        </div>
      </div>
    </div>
  );
}

export default App;
