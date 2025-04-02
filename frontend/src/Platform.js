import './styles/App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConductQuiz from './ConductQuiz';  
import AIChatbox from './AIChatbox';  
import UserRegistration from './UserRegistration';  
import AttendQuiz from './AttendQuiz';  
import EvaluateQuiz from './EvaluateQuiz';
import ViewResult from './ViewResult';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);  
  const [loading, setLoading] = useState(true);  // Add a loading state
  const navigate = useNavigate();  // Initialize the navigate function to redirect

  useEffect(() => {
    // Check if token exists in sessionStorage when component mounts
    const token = sessionStorage.getItem('token');
    console.log('Token in sessionStorage:', token);  // Log the token for debugging
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);  // Once the check is complete, stop loading
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (loading) return; // Prevent navigation until loading state is false

    if (!isAuthenticated) {
      navigate('/');  // Redirect to the login page if not authenticated
    }
  }, [isAuthenticated, loading, navigate]);  // Watch for changes in `isAuthenticated` and `loading`

  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };


  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove the token
    setIsAuthenticated(false);         // Set authenticated state to false
    navigate('/');                // Redirect to login page
  };

  if (loading) {
    return <div>Loading...</div>;  // Show a loading message while checking the token
  }

  // Now that loading is done, only show content if authenticated
  if (!isAuthenticated) {
    return <div>Redirecting...</div>;  // Show redirecting message (or use a loader) if not authenticated
  }

  return (
    <div className="App">

      {/* Welcome Section */}
      <div className="welcome">
        <h1>Welcome to MTS Platform!</h1>
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
