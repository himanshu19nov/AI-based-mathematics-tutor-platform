import React, { useState, useEffect } from 'react';
import './styles/AttendQuiz.css';

const AttendQuiz = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [quizLevel, setQuizLevel] = useState('');
  const [quizName, setQuizName] = useState('');
  const [quizCategory, setQuizCategory] = useState('');
  const [username, setUsername] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  const quizNameOptions = ['Math Quiz', 'Science Quiz'];

  const categoryOptions = {
    'Math Quiz': ['Trigonometry', 'Arithmetic', 'Geometry', 'Algebra', 'Calculus'],
    'Science Quiz': ['Physics', 'Chemistry', 'Biology']
  };

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizStarted && timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = async () => {
    if (!quizName || !quizLevel || !quizCategory || !username) {
      alert("Please fill all required fields before starting the quiz.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizName}?level=${quizLevel}&category=${quizCategory}`);
      const data = await response.json();

      if (data.quiz && Array.isArray(data.quiz)) {
        setQuizData(data.quiz);
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setTimeLeft(120); // reset timer
      } else {
        alert("Quiz data not available for selected options.");
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setAnswers({ ...answers, [questionIndex]: selectedAnswer });
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
    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, quizName, answers })
      });

      const result = await response.json();
      setScore(result.score);
      alert(`Quiz Submitted! You scored ${result.score}/${result.totalQuestions}`);
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
            <label>Username</label>
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="dropdown-container">
            <label>Quiz Level</label>
            <select value={quizLevel} onChange={(e) => setQuizLevel(e.target.value)}>
              <option value="">Select Level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="dropdown-container">
            <label>Quiz Name</label>
            <select value={quizName} onChange={(e) => {
              setQuizName(e.target.value);
              setQuizCategory('');
            }}>
              <option value="">Select Quiz</option>
              {quizNameOptions.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {quizName && (
            <div className="dropdown-container">
              <label>Quiz Category</label>
              <select value={quizCategory} onChange={(e) => setQuizCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categoryOptions[quizName].map((category, idx) => (
                  <option key={idx} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}

          <button onClick={handleStartQuiz} className="attend-button">
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-questions">
          <div className="quiz-header">
            <h2>{quizData[currentQuestionIndex].question}</h2>
            <div className="timer">Time Left: {timeLeft}s</div>
          </div>

          <div className="options">
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
        </div>
      )}
    </div>
  );
};

export default AttendQuiz;
