import React, { useState } from "react";
import './styles/ViewResult.css'; // If it's inside a "styles" folder


const ViewResult = () => {
  const [viewType, setViewType] = useState("individual"); // Toggle between individual and overall performance
  const [quizLevel, setQuizLevel] = useState("Beginner");
  const [quizName, setQuizName] = useState("Math Quiz");
  const [username, setUsername] = useState("Student");

  const [questions, setQuestions] = useState([
    { question: "What is 2 + 2?", answer: "4", mark: 3, comments: "Good work" },
    { question: "What is 3 * 3?", answer: "9", mark: 5, comments: "Excellent" },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalScore = questions.reduce((sum, q) => sum + q.mark, 0);

  return (
    <div className="view-result-container">
      <div className="tab-menu">
        <button
          className={viewType === "individual" ? "active" : ""}
          onClick={() => setViewType("individual")}
        >
          Individual Performance
        </button>
        <button
          className={viewType === "overall" ? "active" : ""}
          onClick={() => setViewType("overall")}
        >
          Overall Performance
        </button>
      </div>

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
        <button>View Result</button>
        <button>Export Result (for Teacher)</button>
      </div>

      {viewType === "individual" ? (
        <div className="individual-performance">
          <h2>Individual Performance</h2>
          <p><strong>Highest / Lowest / Avg / Median Score</strong></p>
          <p><strong>Total Score:</strong> {totalScore}</p>

          <div className="question-navigation">
            {questions.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)}>{index + 1}</button>
            ))}
          </div>

          <div className="question-section">
            <p><strong>Question:</strong> {questions[currentIndex].question}</p>
            <p><strong>Answer:</strong> {questions[currentIndex].answer}</p>
            <p><strong>Mark:</strong> {questions[currentIndex].mark}</p>
            <p><strong>Comments:</strong> {questions[currentIndex].comments}</p>
          </div>

          <div className="navigation-buttons">
            <button onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} disabled={currentIndex === 0}>
              Previous
            </button>
            <button onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}>
              {currentIndex === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="overall-performance">
          <h2>Overall Performance</h2>
          <p><strong>Highest / Lowest / Avg / Median Score</strong></p>
          <div className="mark-chart">
            <p>Mark Count Chart</p>
            <ul>
              {[0, 1, 2, 3, 4, 5].map((mark) => (
                <li key={mark}>Mark {mark}: {questions.filter(q => q.mark === mark).length}</li>
              ))}
            </ul>
          </div>
          <div className="navigation-buttons">
            <button>Previous</button>
            <button>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResult;
