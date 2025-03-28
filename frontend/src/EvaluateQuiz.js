import React, { useState } from "react";
import "./styles/EvaluateQuiz.css";

const EvaluateQuiz = () => {
  const [questions, setQuestions] = useState([
    { question: "What is 2 + 2?", answer: "4", mark: 0, comments: "" },
    { question: "What is 3 * 3?", answer: "9", mark: 0, comments: "" },
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizLevel, setQuizLevel] = useState("Beginner");
  const [quizName, setQuizName] = useState("Math Quiz");
  const [username, setUsername] = useState("Student");

  const handleMarkChange = (event) => {
    const newMark = parseInt(event.target.value);
    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentIndex].mark = newMark;
      return updated;
    });
  };

  const handleCommentChange = (event) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentIndex].comments = event.target.value;
      return updated;
    });
  };

  const goToQuestion = (index) => setCurrentIndex(index);

  const totalScore = questions.reduce((sum, q) => sum + q.mark, 0);

  return (
    <div className="container">
      <h1>Evaluate Quiz</h1>
      
      <div className="selection-container">
        <label>Quiz Level:</label>
        <select value={quizLevel} onChange={(e) => setQuizLevel(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        
        <label>Quiz Name:</label>
        <select value={quizName} onChange={(e) => setQuizName(e.target.value)}>
          <option>Math Quiz</option>
          <option>Science Quiz</option>
        </select>
        
        <label>Username:</label>
        <select value={username} onChange={(e) => setUsername(e.target.value)}>
          <option>Student</option>
          <option>Teacher</option>
        </select>
      </div>
      
      <div className="button-container">
        <button>Evaluate</button>
        <button>AI Evaluate</button>
      </div>
      
      <div className="score-container">
        <span>Total Score: {totalScore}</span>
      </div>
      
      <div className="question-navigation">
        {questions.map((_, index) => (
          <button key={index} onClick={() => goToQuestion(index)}>{index + 1}</button>
        ))}
      </div>
      
      <div className="question-section">
        <p><strong>Question:</strong> {questions[currentIndex].question}</p>
        <p><strong>Answer:</strong> {questions[currentIndex].answer}</p>
        
        <label>Mark:</label>
        <select value={questions[currentIndex].mark} onChange={handleMarkChange}>
          {[0, 1, 2, 3, 4, 5].map((mark) => (
            <option key={mark} value={mark}>{mark}</option>
          ))}
        </select>
        
        <label>Comments:</label>
        <textarea
          value={questions[currentIndex].comments}
          onChange={handleCommentChange}
          placeholder="Enter comments"
        />
      </div>
      
      <div className="navigation-buttons">
        <button onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} disabled={currentIndex === 0}>Previous</button>
        <button onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}>
          {currentIndex === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default EvaluateQuiz;/EvaluateQuiz""/;

