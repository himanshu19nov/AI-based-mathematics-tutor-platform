import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewResult = () => {
  const [tab, setTab] = useState("individual");
  const [level, setLevel] = useState("Beginner");
  const [quiz, setQuiz] = useState("Math Quiz");
  const [username, setUsername] = useState("Student");
  const [viewingResult, setViewingResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [resultData, setResultData] = useState([]);

  // Dummy API endpoint placeholders
  const FETCH_RESULT_API = `/api/results/fetch`; // Replace with real GET endpoint
  const SUBMIT_RESULT_API = `/api/results/submit`; // Replace with real POST/PUT endpoint

  // Fetch result data on first load or when viewingResult becomes true
  useEffect(() => {
    if (viewingResult) {
      axios
        .get(FETCH_RESULT_API, {
          params: {
            username,
            quiz,
            level,
          },
        })
        .then((res) => setResultData(res.data))
        .catch((err) => {
          console.error("Error fetching result:", err);
          // Fallback dummy data
          setResultData([
            {
              question: "What is 2 + 2?",
              answer: "4",
              mark: 3,
              comments: "Good work",
            },
            {
              question: "Capital of France?",
              answer: "Paris",
              mark: 5,
              comments: "Excellent",
            },
          ]);
        });
    }
  }, [viewingResult]);

  const totalScore = resultData.reduce((acc, cur) => acc + (cur.mark || 0), 0);

  const handleBack = () => {
    setViewingResult(false);
    setCurrentQuestion(0);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(SUBMIT_RESULT_API, {
        username,
        quiz,
        level,
        results: resultData,
      });
      alert("Evaluation submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit evaluation");
    }
  };

  const individualView = (
    <>
      <h3>Individual Performance</h3>
      <p>
        <strong>Quiz Level:</strong> {level}
      </p>
      <p>
        <strong>Quiz Name:</strong> {quiz}
      </p>
      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>Total Score:</strong> {totalScore}
      </p>
      <div>
        {resultData.map((_, i) => (
          <button key={i} onClick={() => setCurrentQuestion(i)}>
            {i + 1}
          </button>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <p>
          <strong>Question:</strong> {resultData[currentQuestion]?.question}
        </p>
        <p>
          <strong>Answer:</strong> {resultData[currentQuestion]?.answer}
        </p>
        <label>
          <strong>Mark:</strong>{" "}
          <select
            value={resultData[currentQuestion]?.mark || 0}
            onChange={(e) => {
              const updated = [...resultData];
              updated[currentQuestion].mark = Number(e.target.value);
              setResultData(updated);
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          <strong>Comments:</strong>
          <br />
          <textarea
            value={resultData[currentQuestion]?.comments || ""}
            onChange={(e) => {
              const updated = [...resultData];
              updated[currentQuestion].comments = e.target.value;
              setResultData(updated);
            }}
          />
        </label>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentQuestion === resultData.length - 1}
          onClick={() => setCurrentQuestion((prev) => prev + 1)}
        >
          Next
        </button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <button style={{ marginTop: "1rem" }} onClick={handleBack}>
        Back
      </button>
    </>
  );

  const overallView = (
    <>
      <h3>Overall Performance</h3>
      <p>
        <strong>Quiz Level:</strong> {level}
      </p>
      <p>
        <strong>Quiz Name:</strong> {quiz}
      </p>
      <p>
        <strong>Highest / Lowest / Avg / Median Score:</strong> 5 / 3 / 4 / 4
      </p>
      <button onClick={handleBack}>Back</button>
    </>
  );

  return (
    <div style={{ padding: "3rem" }}>
      {!viewingResult ? (
        <>
          <div>
            <button
              onClick={() => setTab("individual")}
              style={{ background: tab === "individual" ? "#ccc" : "white" }}
            >
              Individual Performance
            </button>
            <button
              onClick={() => setTab("overall")}
              style={{ background: tab === "overall" ? "#ccc" : "white" }}
            >
              Overall Performance
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>Quiz Level: </label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <label> Quiz Name: </label>
            <select value={quiz} onChange={(e) => setQuiz(e.target.value)}>
              <option value="Math Quiz">Math Quiz</option>
              <option value="Science Quiz">Science Quiz</option>
            </select>

            <label> Username: </label>
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            >
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={() => setViewingResult(true)}>View Result</button>
            <button onClick={() => alert("Exported successfully!")}>
              Export Result (for Teacher)
            </button>
          </div>
        </>
      ) : tab === "individual" ? (
        individualView
      ) : (
        overallView
      )}
    </div>
  );
};

export default ViewResult;
