import React, { useState, useEffect } from 'react';
import './styles/AttendQuiz.css';

const AttendQuiz = () => {
  const [quizLevel, setQuizLevel] = useState('');
  const [quizName, setQuizName] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // Timer feature

  useEffect(() => {
    fetch('http://localhost:5000/api/quizzes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuizzes(data);
        }
      })
      .catch(err => console.error('Error fetching quizzes:', err));
  }, []);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = async () => {
    if (!quizName) return;
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizName}`);
      const data = await response.json();
      setQuizData(data.quiz);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setTimeLeft(60); // Reset timer
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
        body: JSON.stringify({ quizName, answers })
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
            <select value={quizName} onChange={(e) => setQuizName(e.target.value)}>
              <option value="">Select Quiz</option>
              {quizzes.map((quiz, idx) => (
                <option key={idx} value={quiz}>{quiz}</option>
              ))}
            </select>
          </div>

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

/* This the backend API integration code */