import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';  // Import Routes and Route for route handling
import './styles/App.css';
import Login from './Login';
import Platform from './Platform'; 
import ConductQuiz from './ConductQuiz';
import AIChatbox from './AIChatbox';
import UserRegistration from './UserRegistration';
import AttendQuiz from './AttendQuiz';
import EvaluateQuiz from './EvaluateQuiz';
import ViewResult from './ViewResult';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // State to handle authentication

  return (
    <div>
      <Routes>  {/* Define your routes here */}
        {/* Public routes */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />  {/* Login page */}
        
        {/* Protected routes (only accessible if authenticated) */}
        {isAuthenticated && (
          <>
            <Route path="/platform" element={<Platform />} />  {/* Dashboard page */}
            <Route path="/conduct-quiz" element={<ConductQuiz />} />
            <Route path="/chatbox" element={<AIChatbox />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/attend-quiz" element={<AttendQuiz />} />
            <Route path="/evaluate-quiz" element={<EvaluateQuiz />} />
            <Route path="/evaluate-quiz" element={<ViewResult />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
