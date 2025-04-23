import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './styles/ConductQuiz.css'; 

const QuizSetup = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [questionLevel, setQuestionLevel] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const handleCategoryChange = (e) => {
    setQuestionCategory(e.target.value);
  };
  const [questions, setQuestions] = useState([]);  // Store the list of questions fetched from the backend
  const [selectedQuestions, setSelectedQuestions] = useState([]);  // Store selected questions
  const [quizName, setQuizName] = useState('');
  const [quizLevel, setQuizLevel] = useState('');
  const totalScore = selectedQuestions.reduce((acc, q) => acc + Number(q.score || 0), 0);

  
  const token = sessionStorage.getItem('token');


  // Fetch questions when question level or category changes
  useEffect(() => {
    if (questionLevel && questionCategory) {
      // axios.get('http://localhost:8000/api/search_questions/', {
      axios.get(`${apiUrl}/api/search_questions/`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          difficulty_level: questionLevel,
          category: questionCategory,
        }
      })
      .then(response => {
        console.log("✅ Questions fetched from backend:", response.data);
        setQuestions(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the questions:", error);
      });
    }
  }, [questionLevel, questionCategory]);

  const handleQuestionSelect = (questionId) => {
    // Add the selected question to the selected questions list
    const question = questions.find(q => q.question_id === questionId);
      // Check if it's already selected
    const alreadySelected = selectedQuestions.some(q => q.question_id === questionId);
    if (question && !selectedQuestions.some(q => q.question_id === question.question_id)) {
      setSelectedQuestions([...selectedQuestions, { ...question, score: 1 }]);  // Default score set to 1
    }
  };

  const handleQuestionRemove = (questionId) => {
    // Remove a question from the selected list
    setSelectedQuestions(selectedQuestions.filter(q => q.question_id !== questionId));
  };

  const handleScoreChange = (questionId, newScore) => {
    // Update the score of a selected question
    const updatedQuestions = selectedQuestions.map(q =>
      q.question_id === questionId ? { ...q, score: newScore } : q
    );
    setSelectedQuestions(updatedQuestions);
  };

  const handleSubmit = () => {

    const token = sessionStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to create a quiz.');
      return;
    }
  
    let decodedUsername = '';
    try {
      const decoded = jwtDecode(token);
      decodedUsername = decoded.username;
    } catch (error) {
      console.error('Invalid token:', error);
      alert('Session expired or invalid token.');
      return;
    }

    // Create the quiz object to be sent to the backend
    const quizData = {
      username: decodedUsername,
      quizName,
      quizLevel,
      quizStatus: "draft",
      selectedQuestions: selectedQuestions.map(q => ({
        questionId: q.question_id,
        score: q.score,
      })),
    };

    // Submit the quiz data to the backend
    // axios.post('http://localhost:8000/api/create_quiz/', quizData,
    axios.post(`${apiUrl}/api/create_quiz/`, quizData,
    {
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      }
    )
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
      <div style={{textAlign:"center", fontWeight:"bold"}}> Quiz Setup</div>
    <div className="form-grid">
      <div className="form-row">
        <label>
          Question Level </label>
          <select
            value={questionLevel}
            onChange={(e) => setQuestionLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="kindergartens">Kindergartens</option>
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

            {/* Question Category */}
            <div className="form-row">
              <label>Question Category</label>
              <div className="radio-buttons category-grid">
                {['Trigonometry', 'Arithmetic', 'Geometry', 'Algebra', 'Calculus'].map((cat) => (
                <label key={cat} className="radio-option">
                  <input
                    type="radio"
                    name="questionCategory"
                    value={cat}
                    checked={questionCategory === cat}
                    onChange={handleCategoryChange}
                  />
                  {cat}
                </label>
                ))}
              </div>
            </div>

      <div className = "form-row">
        <h3>Available Questions</h3>

          {/* Header row */}
        <div className="list-header">
          <span className="id-col">ID</span>
          <span className="question-col">Question</span>
          <span className="action-col">Action</span>
        </div>
        <ul className="scrollable-list">
          {questions.map((question) => (
            <li key={question.question_id} className="question_item">
              <span className="id-col">{question.question_id}</span> 
              <span className="question-col">{question.question_text}</span>
              <span className="action-col">
              <button className="add_remove_button" 
              onClick={() => handleQuestionSelect(question.question_id)}
              disabled={selectedQuestions.some(q => q.question_id === question.question_id)}>
                Add
              </button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className = "form-row">
        <h3>Selected Questions</h3>

        <div className="list-header">
        <span className="id-col">ID</span>
        <span className="question-col">Question</span>
        <span className="score-col">Score</span>
        <span className="action-col">Action</span>
        </div>

        <ul className="scrollable-list">
          {selectedQuestions.map((question) => (
            <li key={question.question_id} className="question_item">
              <span className="id-col">{question.question_id}</span>
              <span className="question-col">{question.question_text}</span>
              <span className="score-col">
              <input
                style={{textAlign:'center', width:'5ch'}}
                type="number"
                value={question.score}
                onChange={(e) => handleScoreChange(question.question_id, e.target.value)}
                min="1"
                max="10"  // Adjust based on your score range
              />
              </span>
              <span className="action-col">
              <button className="add_remove_button" onClick={() => handleQuestionRemove(question.question_id)}>
                Remove
              </button>
              </span>
            </li>
          ))}
        </ul>

        {/* Display total score */}
        <div className='list-header'>
          <span style={{flex:2}}></span>
          <span style={{flex:1}}>
            Total Score: {totalScore}
            </span>
        </div>

      </div>

      <div className = "form-row">
        <label>
          <span style={{marginRight:"10px"}}>
          Quiz Name 
          </span>
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
          <span style={{marginRight:"18px"}}>
          Quiz Level 
          </span>
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
