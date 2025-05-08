import React, { useState, useEffect } from 'react';
import './styles/AttendQuiz.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AttendQuiz = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState('');
  const [role, setUserRole] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [quizLevel, setQuizLevel] = useState('');
  const [quizName, setQuizName] = useState('');
  const [quizId, setQuizId] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  // const [quizCategory, setQuizCategory] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); 

  const [quizNameOptions, setQuizNameOptions] = useState([]);


  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        setUserRole(decoded.role);  

        axios.get(`${apiUrl}/api/users/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { username: decoded.username }
        })
        .then(response => {
          const user = response.data.find(u => u.username === decoded.username);
          if (user) {
            console.log("Matched user:", user);
            setAcademicLevel(user.academicLevel);  
          } else {
            console.warn("User not found in response.");
          }
        })
        .catch(error => {
          console.error('Error fetching user academic level:', error);
        });

      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
  
    axios.get(`${apiUrl}/api/list_quiz/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const publishedQuizzes = response.data.filter(q => q.quiz_status === 'published');
      setQuizOptions(publishedQuizzes);  
    })
    .catch(error => {
      console.error("Error fetching quizzes:", error);
    });
  }, []);
  

  useEffect(() => {
    if (quizLevel && quizOptions.length > 0) {
      const filtered = quizOptions
        .filter(q => q.quiz_level === quizLevel)
        .map(q => q.quiz_title);
      setQuizNameOptions(filtered);
    } else {
      setQuizNameOptions([]);
    }
  }, [quizLevel, quizOptions]);
  

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizStarted && timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = async () => {
    if (!quizName || !quizLevel ) {
      alert("Please fill all required fields before starting the quiz.");
      return;
    }
    
    console.log("POSTING to /api/attend_quiz");


    try {
      // const response = await fetch('http://localhost:8000/api/attend_quiz/', {
      const response = await fetch(`${apiUrl}/api/attend_quiz/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quizId,
          // quiz_name: quizName,
          // quiz_level: quizLevel,
          // category: quizCategory
        })
      });

  
      const data = await response.json();
  
      if (response.ok && data.quiz && Array.isArray(data.quiz)) {
        setQuizData(data.quiz);
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setTimeLeft(120); // reset timer
      } else {
        alert(data.error || "Quiz data not available for selected options.");
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert("Failed to start quiz. Please try again later.");
    }
  };
  
  // const handleAnswerChange = (questionIndex, selectedAnswer) => {
  //   setAnswers({ ...answers, [questionIndex]: selectedAnswer });
  // };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    const question = quizData[questionIndex];
    const questionId = question?.questionId;

    if (!questionId) {
      console.error('Invalid questionId:', question);
      return; 
    }
    setAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }));
  };

  const renderInputForQuestion = (question, index) => {
    const questionId = question.questionId;
    const selected = answers[questionId] || (question.ans_type === 'multiple_choice' ? [] : '');
  
    if (question.ans_type === 'textbox') {
      return (
        <textarea
        value={selected}
        onChange={(e) => handleAnswerChange(index, e.target.value)}
        rows="4"        
        cols="50"       
      />
      );
    }
  
    if (question.ans_type === 'single_choice') {
      return question.options.map((option, i) => (
        <label key={i}>
          <input
            type="radio"
            name={`question-${index}`}
            value={option}
            onChange={() => handleAnswerChange(index, option)}
            checked={selected === option}
          />
          {option}
        </label>
      ));
    }
  
    if (question.ans_type === 'multiple_choice') {
      return question.options.map((option, i) => (
        <label key={i}>
          <input
            type="checkbox"
            name={`question-${index}`}
            value={option}
            onChange={(e) => {
              const newSelection = e.target.checked
                ? [...selected, option]
                : selected.filter(item => item !== option);
              handleAnswerChange(index, newSelection);
            }}
            checked={selected.includes(option)}
          />
          {option}
        </label>
      ));
    }
  
    return <p>Unsupported question type</p>;
  };



  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    console.log('Quiz data:', quizData);
    console.log('Answers:', answers);
    try {
      // const response = await fetch('http://localhost:8000/api/submit_quiz/', {
      const response = await fetch(`${apiUrl}/api/submit_quiz/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, quizId , answers })
      });

      const result = await response.json();
      alert(`Quiz Submitted!`);
      setQuizStarted(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
  

  const renderQuestionNumbers = () => {
    return quizData.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentQuestionIndex(index)}
        className={`question-number ${index === currentQuestionIndex ? 'active' : ''}`}
      >
        {index + 1}
      </button>
    ));
  };

  return (
    <div className="attend-quiz-container">
      {!quizStarted ? (
        <div className="quiz-setup">

          <div className="dropdown-container">
            <label>Quiz Level</label>
            <select
              value={quizLevel}
              onChange={(e) => setQuizLevel(e.target.value)}
            >
              <option value="">Select Level</option>
              {role === 'student' && academicLevel ? (
                academicLevel.split(',').map(level => (
                  <option key={level.trim()} value={level.trim().toLowerCase().replace(' ', '_')}>
                    {level.trim()}
                  </option>
                ))
              ) : (
                ['kindergartens', 'year_1', 'year_2', 'year_3', 'year_4', 'year_5', 'year_6',
                'year_7', 'year_8', 'year_9', 'year_10', 'year_11', 'year_12']
                  .map(level => (
                    <option key={level} value={level}>
                      {level.replace('_', ' ').toUpperCase()}
                    </option>
                  ))
              )}
            </select>
          </div>

          

          <div className="dropdown-container">
            <label>Quiz Name</label>
            <select value={quizName} onChange={(e) => {
              const selectedTitle = e.target.value;
              setQuizName(selectedTitle);

              const selectedQuiz = quizOptions.find(q => q.quiz_title === selectedTitle);
              setQuizId(selectedQuiz ? selectedQuiz.quiz_id : null);
            }}>
            {/* <select value={quizName} onChange={(e) => {
              setQuizName(e.target.value);
              setQuizCategory('');
            }}> */}
              <option value="">Select Quiz</option>
              {quizNameOptions.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* {quizName && (
            <div className="dropdown-container">
              <label>Quiz Category</label>
              <select value={quizCategory} onChange={(e) => setQuizCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categoryOptions[quizName].map((category, idx) => (
                  <option key={idx} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )} */}

          <button onClick={handleStartQuiz} className="attend-button">
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-questions">
          {quizData.length === 0 || !quizData[currentQuestionIndex] ? (
          <p>Loading quiz questions...</p>
        ) : (
        <>
          <div className="quiz-header">
            <div className="timer">Time Left: {timeLeft}s</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                <span>Question:  </span>
                 {quizData[currentQuestionIndex].question}
              </div>
          </div>

          {/* <div className="options">
           {quizData[currentQuestionIndex].options.map((option, idx) => (
            <label key={idx}>
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={option}
              onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
              checked={answers[currentQuestionIndex] === option}
            />
            {option}
            </label>
            ))}
          </div> */}

      <div className="options">
        {renderInputForQuestion(quizData[currentQuestionIndex], currentQuestionIndex)}
      </div>

      <div className="question-navigation">
        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
        {currentQuestionIndex === quizData.length - 1 ? (
          <button onClick={handleSubmitQuiz}>Submit</button>
        ) : (
          <button onClick={handleNextQuestion}>Next</button>
        )}
      </div>

        <div className="question-numbers">
        <h3>Select Question:</h3>
        {renderQuestionNumbers()}
        </div>
        </>
        )}
      </div>

      )}
    </div>
  );
};

export default AttendQuiz;
