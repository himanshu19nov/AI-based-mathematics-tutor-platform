import './styles/App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConductQuiz from './ConductQuiz';  // No need for '.js' extension
import AIChatbox from './AIChatbox';  // No need for '.js' extension
import UserRegistration from './UserRegistration';  // Correct path to UserRegistration.js
import AttendQuiz from './AttendQuiz';  // Add AttendQuiz import
import EvaluateQuiz from './EvaluateQuiz';
import ViewResult from './ViewResult';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);  // Assuming user is logged in initially
  const navigate = useNavigate();  // Initialize the navigate function to redirect

  const token = sessionStorage.getItem('token');
  // if (token) {
  //   setIsAuthenticated(true);
  // } else {
  //   setIsAuthenticated(false);
  // }


  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };


  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove the token
    setIsAuthenticated(false);         // Set authenticated state to false
    navigate('/');                // Redirect to login page
  };

  if (!isAuthenticated) {
      //alert('You have been logged out. Please log in to access the platform.');
      navigate('/');
  }

  return (
    <div className="App">

      {/* Welcome Section */}
      <div className="welcome">
        <h1>Welcome to The Collaborative Intelligence Mathematics Tutoring Service Platform!</h1>
        <p>Choose a function from the sidebar to get started.</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="content-container">
        {/* Sidebar Section */}
        <div className="sidebar">
          <button className={`sidebar-button ${selectedOption === 'userRegistration' ? 'active' : ''}`} onClick={() => handleMenuClick('userRegistration')}>User Registration</button>
          <button className={`sidebar-button ${selectedOption === 'conductQuiz' ? 'active' : ''}`} onClick={() => handleMenuClick('conductQuiz')}>Conduct Quiz</button>
          <button className={`sidebar-button ${selectedOption === 'attendQuiz' ? 'active' : ''}`} onClick={() => handleMenuClick('attendQuiz')}>Attend Quiz</button>
          <button className={`sidebar-button ${selectedOption === 'evaluateQuiz' ? 'active' : ''}`} onClick={() => handleMenuClick('evaluateQuiz')}>Evaluate Quiz</button>
          <button className={`sidebar-button ${selectedOption === 'chatbox' ? 'active' : ''}`} onClick={() => handleMenuClick('chatbox')}>Q&A Chatbox</button>
          <button className={`sidebar-button ${selectedOption === 'viewResult' ? 'active' : ''}`} onClick={() => handleMenuClick('viewResult')}>View Result</button>
        </div>

        <div className="main-content">
          {selectedOption === 'userRegistration' && <UserRegistration />}
          {selectedOption === 'conductQuiz' && <ConductQuiz />}
          {selectedOption === 'attendQuiz' && <AttendQuiz />}  {/* Added AttendQuiz */}
          {selectedOption === 'evaluateQuiz' && <EvaluateQuiz />}
          {selectedOption === 'chatbox' && <AIChatbox />}
          {selectedOption === 'viewResult' && <ViewResult />}
        </div>

      </div>

    </div>
  );
}

export default App;
