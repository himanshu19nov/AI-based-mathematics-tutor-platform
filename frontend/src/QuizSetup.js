import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ConductQuiz.css'; 

const QuizSetup = () => {
  const [questionLevel, setQuestionLevel] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [questions, setQuestions] = useState([]);  // Store the list of questions fetched from the backend
  const [selectedQuestions, setSelectedQuestions] = useState([]);  // Store selected questions
  const [quizName, setQuizName] = useState('');
  const [quizLevel, setQuizLevel] = useState('');
  
  // Fetch questions when question level or category changes
  useEffect(() => {
    if (questionLevel && questionCategory) {
      axios.get('http://localhost:8000/api/search_questions/', {
        params: {
          question_level: questionLevel,
          question_category: questionCategory,
        }
      })
      .then(response => {
        setQuestions(response.data.questions);
      })
      .catch(error => {
        console.error("There was an error fetching the questions:", error);
      });
    }
  }, [questionLevel, questionCategory]);

  const handleQuestionSelect = (questionId) => {
    // Add the selected question to the selected questions list
    const question = questions.find(q => q.id === questionId);
    if (question && !selectedQuestions.some(q => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, { ...question, score: 1 }]);  // Default score set to 1
    }
  };

  const handleQuestionRemove = (questionId) => {
    // Remove a question from the selected list
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
  };

  const handleScoreChange = (questionId, newScore) => {
    // Update the score of a selected question
    const updatedQuestions = selectedQuestions.map(q =>
      q.id === questionId ? { ...q, score: newScore } : q
    );
    setSelectedQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    // Create the quiz object to be sent to the backend
    const quizData = {
      quizName,
      quizLevel,
      selectedQuestions: selectedQuestions.map(q => ({
        questionId: q.id,
        score: q.score,
      })),
    };

    // Submit the quiz data to the backend
    axios.post('http://localhost:8000/api/create_quiz/', quizData)
      .then(response => {
        alert('Quiz created successfully!');
      })
      .catch(error => {
        console.error("There was an error creating the quiz:", error);
        alert('Error creating the quiz');
      });
  };

  return (
    <div className="form-container">
    <div className="form-grid">
      <div className="form-row">
        <label>
          Question Level </label>
          <select
            value={questionLevel}
            onChange={(e) => setQuestionLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="kindergarten">Kindergarten</option>
            <option value="year_1">Year 1</option>
            <option value="year_2">Year 2</option>
            <option value="year_3">Year 3</option>
            <option value="year_4">Year 4</option>
            <option value="year_5">Year 5</option>
            <option value="year_6">Year 6</option>
            <option value="year_7">Year 7</option>
            <option value="year_8">Year 8</option>
            <option value="year_9">Year 9</option>
            <option value="year_10">Year 10</option>
            <option value="year_11">Year 11</option>
            <option value="year_12">Year 12</option>
            
          </select>
        
      </div>

      <div className="form-row">
        <label>
          Question Category </label>
          <select
            value={questionCategory}
            onChange={(e) => setQuestionCategory(e.target.value)}
          >
            <option value="">Select Category</option>c
            <option value="trigonometry">Trigonometry</option>
            <option value="arithmetic">Arithmetic</option>
            <option value="geometry">Geometry</option>
            <option value="algebra">Algebra</option>
            <option value="calculus">Calculus</option>
          </select>
        
      </div>

      <div className = "form-row">
        <h3>Available Questions</h3>
        <ul className="scrollable-list">
          {questions.map((question) => (
            <li key={question.id}>
              <span>{question.question}</span>
              <button onClick={() => handleQuestionSelect(question.id)}>
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className = "form-row">
        <h3>Selected Questions</h3>
        <ul className="scrollable-list">
          {selectedQuestions.map((question) => (
            <li key={question.id}>
              <span>{question.question}</span>
              <input
                type="number"
                value={question.score}
                onChange={(e) => handleScoreChange(question.id, e.target.value)}
                min="1"
                max="10"  // Adjust based on your score range
              />
              <button onClick={() => handleQuestionRemove(question.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className = "form-row">
        <label>
          Quiz Name
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Enter quiz name"
          />
        </label>
      </div>

      <div className = "form-row">
        <label>
          Quiz Level
          <select
            value={quizLevel}
            onChange={(e) => setQuizLevel(e.target.value)}
          >
            <option value="kindergarten">Kindergarten</option>
            <option value="year_1">Year 1</option>
            <option value="year_2">Year 2</option>
            <option value="year_3">Year 3</option>
            <option value="year_4">Year 4</option>
            <option value="year_5">Year 5</option>
            <option value="year_6">Year 6</option>
            <option value="year_7">Year 7</option>
            <option value="year_8">Year 8</option>
            <option value="year_9">Year 9</option>
            <option value="year_10">Year 10</option>
            <option value="year_11">Year 11</option>
            <option value="year_12">Year 12</option>
          </select>
        </label>
      </div>

      <div>
        <button className="button" onClick={handleSubmit}>Create Quiz</button>
      </div>
    </div>
    </div>
  );
};

export default QuizSetup;
