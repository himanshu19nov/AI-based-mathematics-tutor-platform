import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ConductQuiz.css';

const QuizSearch = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');  // State to store selected filter
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);  // State to store filtered quizzes

  const [updatedStatus, setUpdatedStatus] = useState('');

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    // axios.get('http://localhost:8000/api/list_quiz/', {
    axios.get(`${apiUrl}/api/list_quiz/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      setQuizzes(response.data);
      setFilteredQuizzes(response.data);  // Initially display all quizzes
    })
    .catch((error) => {
      console.error('Error fetching quizzes:', error);
    });
  }, [token]);

  const handleView = (quiz) => {
    setUpdatedStatus(quiz.quiz_status);
    setSelectedQuiz(quiz);
    setShowQuizDetails(true);
  };

  const handleLevelChange = (event) => {
    const selectedLevel = event.target.value;
    setSelectedLevel(selectedLevel);

    // Filter quizzes based on the selected level
    if (selectedLevel) {
      const filtered = quizzes.filter(quiz => quiz.quiz_level === selectedLevel);
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes);  // If no level is selected, show all quizzes
    }
  };

  const updateQuizStatus = (quizId, status) => {
    // axios.put(`http://localhost:8000/api/quiz/${quizId}/status/`, 
    axios.put(`${apiUrl}/api/quiz/${quizId}/status/`, 
      { quiz_status: status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then((response) => {
      alert('Status updated!');
      const updated = quizzes.map(q => 
        q.quiz_id === quizId ? { ...q, quiz_status: status } : q
      );
      setQuizzes(updated);
      setFilteredQuizzes(updated);
      setSelectedQuiz({ ...selectedQuiz, quiz_status: status });
      setShowQuizDetails(false)
    })
    .catch((error) => {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    });
  };



  return (
    <div className="form-container">
      <div style={{textAlign:"center", fontWeight:"bold"}}> Quiz Publish</div>
      {/* Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="level-filter">Quiz Level: </label>
        <select
          id="level-filter"
          value={selectedLevel}
          onChange={handleLevelChange}
        >
          <option value="">All Levels</option>
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


      <h3>Quiz List</h3>
      <div className="list-header">
        <span className="id-col">ID</span>
        <span className="question-col">Quiz Title</span>
        <span className="level-col">Level</span>
        <span className="level-col">Status</span>
        <span style={{flex:2}}>Action</span>
      </div>
      
      <ul className="scrollable-list">
        {filteredQuizzes.map((quiz) => (
          <li key={quiz.quiz_id} className="question_item">
            <span className="id-col">{quiz.quiz_id}</span>
            <span className="question-col">{quiz.quiz_title}</span>
            <span className="level-col">{quiz.quiz_level}</span>
            <span className="level-col">{quiz.quiz_status}</span>
            <span style={{flex:2}}>
              <button className="add_remove_button" onClick={() => handleView(quiz)}>View</button>
            </span>
          </li>
        ))}
      </ul>

      {showQuizDetails && selectedQuiz && (
        <div className="form-container">
          <h4>Quiz Details</h4>
          
          <div className="quiz-info-table">
            <div className="info-row">
              <span className="info-label">Title:</span>
              <span className="info-value">{selectedQuiz.quiz_title}</span>
              <span className="info-label">Status:</span>
              <select
                className="info-value"
                style={{width:"150px"}}
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="info-row">
              <span className="info-label">Level:</span>
              <span className="info-value">{selectedQuiz.quiz_level}</span>
              <span className="info-label">Total Marks:</span>
              <span className="info-value">{selectedQuiz.total_marks}</span>
            </div>
          </div>
          
          <div className="info-row questions-row">
          
              <div className="question-list-header">
                <span className="question-text-header">Questions</span>
                <span className="score-header">Score</span>
              </div>
              <ol className="question-list">
                {selectedQuiz.questions.map((q, index) => (
                  <li key={index} className="question-item">
                    <span className="question-text">{q.question.question_text}</span>
                    <span className="question-score">{q.score}</span>
                  </li>
                ))}
              </ol>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", marginBottom: "2rem" }}>
              <button
                className="button"
                onClick={() => updateQuizStatus(selectedQuiz.quiz_id, updatedStatus)}
              >
                Update Status
              </button>
  
                <button className="add_remove_button" onClick={() => setShowQuizDetails(false)}>Close Details</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default QuizSearch;
