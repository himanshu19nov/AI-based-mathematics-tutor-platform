import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./styles/EvaluateQuiz.css";

const EvaluateQuiz = () => {
    const [quizLevel, setQuizLevel] = useState("");
    const [quizName, setQuizName] = useState("");
    const [username, setUsername] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [marks, setMarks] = useState([]);
    const [comments, setComments] = useState("");
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showTryAgain, setShowTryAgain] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    useEffect(() => {
        if (quizName && quizLevel && username) {
            const apiUrl = `http://localhost:5000/quiz/questions?quizName=${quizName}&quizLevel=${quizLevel}`;
            console.log("API URL: ", apiUrl);  // Log to confirm the URL is correct
            
            axios.get(apiUrl)
                .then((response) => {
                    console.log('API Response:', response);  // Log the full response
                    if (response.data && response.data.questions) {
                        setQuestions(response.data.questions); // Set questions state
                    } else {
                        console.error('No questions data in response');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching quiz questions:', error);
                });
        }
    }, [quizName, quizLevel, username]);
    

    const normalizeAnswer = (answer) => {
        return answer.replace(/\s/g, "").toLowerCase(); // Remove spaces and convert to lowercase
    };

    const handleAnswerSubmit = () => {
        if (!userAnswer.trim()) {
            alert("Please enter an answer!");
            return;
        }

        const correctAnswer = questions[currentQuestionIndex].answer; // Assuming the correct answer is in the 'answer' field
        const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

        setMarks([...marks, isCorrect ? 1 : 0]);

        // Provide feedback for the answer
        setComments(isCorrect ? "Correct! Great job." : `Incorrect! The correct answer is: ${correctAnswer}`);

        // Clear the input field
        setUserAnswer("");

        // Move to the next question or finish the quiz
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizCompleted(true);
            setShowTryAgain(true);
            const totalScore = marks.reduce((sum, mark) => sum + mark, 0) + (isCorrect ? 1 : 0); // Include current answer
            const resultMessage = totalScore === questions.length ? "🎉 Well done, keep it up! 🎉" : "❌ Try again! ❌";
            setResultMessage(resultMessage);
        }
    };

    // Submit quiz results to the backend
    const handleSubmitQuiz = () => {
        const answerSubmission = {
            username,
            quizName,
            quizLevel,
            answers: questions.reduce((acc, question, index) => {
                acc[question] = marks[index] === 1 ? question : ''; // For simplicity, we're just using question text
                return acc;
            }, {})
        };

        axios.post('http://localhost:5000/quiz/submit', answerSubmission)
            .then((response) => {
                const { totalScore, maxScore, resultMessage } = response.data;
                setResultMessage(resultMessage);
            })
            .catch((error) => {
                console.error('Error submitting quiz:', error);
            });
    };

    // Reset the quiz when "Try Again" is clicked
    const handleTryAgain = () => {
        const retryData = { username, quizName, quizLevel };
        axios.post('http://localhost:5000/quiz/retry', retryData)
            .then(() => {
                setQuizLevel("");
                setQuizName("");
                setUsername("");
                setQuestions([]);
                setCurrentQuestionIndex(0);
                setUserAnswer("");
                setMarks([]);
                setComments("");
                setQuizCompleted(false);
                setShowTryAgain(false);
                setResultMessage("");
            })
            .catch((error) => {
                console.error('Error resetting quiz:', error);
            });
    };

    return (
        <div className="container">
            {/* Left Panel - Quiz Selection */}
            <div className="left-panel">
                <label className="bold-text">Quiz Level</label>
                <select className="select-box" value={quizLevel} onChange={(e) => setQuizLevel(e.target.value)}>
                    <option value="">Select Level</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <label className="bold-text">Quiz Name</label>
                <select className="select-box" value={quizName} onChange={(e) => setQuizName(e.target.value)}>
                    <option value="">Select Quiz</option>
                    <option value="Math Quiz">Math Quiz</option>
                    <option value="Science Quiz">Science Quiz</option>
                </select>

                <label className="bold-text">Username</label>
                <select className="select-box" value={username} onChange={(e) => setUsername(e.target.value)}>
                    <option value="">Select User</option>
                    <option value="User1">User1</option>
                    <option value="User2">User2</option>
                </select>
            </div>

            {/* Right Panel - Question Review */}
            <div className="right-panel">
                <label className="bold-text">Quiz Level: {quizLevel}</label>
                <label className="bold-text">Quiz Name: {quizName}</label>
                <label className="bold-text">Username: {username}</label>

                {quizCompleted ? (
                    <div className="quiz-completed">
                        <h2>Quiz Completed!</h2>
                        <p>Total Score: {marks.reduce((sum, mark) => sum + mark, 0)} / {questions.length}</p>
                        <h3>{resultMessage}</h3>
                        {showTryAgain && (
                            <button className="try-again-button" onClick={handleTryAgain}>Try Again</button>
                        )}
                    </div>
                ) : (
                    questions.length > 0 && (
                        <div className="question-container">
                            <label className="bold-text">Question {currentQuestionIndex + 1}:</label>
                            <p>{questions[currentQuestionIndex].question}</p>

                            <label className="bold-text">Your Answer</label>
                            <input 
                                type="text" 
                                className="input-box" 
                                value={userAnswer} 
                                onChange={(e) => setUserAnswer(e.target.value)} 
                                placeholder="Type your answer..."
                            />

                            <label className="bold-text">Comments</label>
                            <textarea 
                                className="textbox" 
                                value={comments} 
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Enter comments (optional)"
                            ></textarea>

                            <div className="nav-buttons">
                                <button onClick={handleAnswerSubmit}>
                                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                                </button>
                                <button onClick={handleSubmitQuiz}>Submit</button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default EvaluateQuiz;


