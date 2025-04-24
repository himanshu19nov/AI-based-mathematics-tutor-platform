import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ConductQuiz.css'; 

const QuestionSearch = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [questionLevel, setQuestionLevel] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const handleCategoryChange = (e) => {
    setQuestionCategory(e.target.value);
  };
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [action, setAction] = useState(null); // Track action (view, modify, delete)


  const [showQuestion, setShowQuestion] = useState(false); // To control form visibility
  const [questionData, setQuestionData] = useState({
    questionLevel: '',
    questionInput: '',
    questionCategory: '',
    ansType: 'textbox',
    answers: [''],
    correctAnswer: ''
  });

  const token = sessionStorage.getItem('token');

  // Fetch questions when question level or category changes
  useEffect(() => {
    if (questionLevel && questionCategory) {
      // Reset view state
      setShowQuestion(false);
      setSelectedQuestion(null);
      setAction(null);

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


  // Handle modify action
  const handleModify = (question) => {
    setSelectedQuestion(question);
    setQuestionData({
      questionLevel: question.difficulty_level,
      questionInput: question.question_text,
      questionCategory: question.category,
      ansType: question.ansType || 'textbox',
      // answers: Array.isArray(question.answers) ? question.answers : [''],
      answers: Array.isArray(question.answers)
      ? question.answers
      : JSON.parse(question.answers.replace(/'/g, '"') || '[]'), // Replace single quotes with double quotes
      correctAnswer: question.correct_answer || ''
    });
    setShowQuestion(true); // Show the form when modifying a question
    setAction('modify');
  };

  // Handle view action
  const handleView = (question) => {
    setSelectedQuestion(question);

    setQuestionData({
      questionLevel: question.difficulty_level,
      questionInput: question.question_text,
      questionCategory: question.category,
      ansType: question.ansType || 'textbox',
      answers: Array.isArray(question.answers)
      ? question.answers
      : JSON.parse(question.answers.replace(/'/g, '"') || '[]'), // Replace single quotes with double quotes
     correctAnswer: question.correct_answer || ''
    });

    setAction('view');
    setShowQuestion(true); 
  };

  // Handle delete action
  const handleDelete = (question) => {
    setSelectedQuestion(question);
    setAction('delete');
  };

  // Handle input change for the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuestionData((prevData) => ({
        ...prevData,
        [name]: value
    }));
    };

  // Handle adding answer options dynamically
  const handleAddAnswerOption = () => {
    setQuestionData((prevData) => ({
      ...prevData,
      answers: [...prevData.answers, '']
    }));
  };

  // Handle Confirm Modify
  const handleConfirmModify = async () => {
    try {
      // await axios.put(`http://localhost:8000/api/questions/${selectedQuestion.id}/`, {
      await axios.put(`${apiUrl}/api/questions/${selectedQuestion.id}/`, {
        text: questionData.questionInput,
        level: questionData.questionLevel,
        category: questionData.questionCategory,
        ansType: questionData.ansType,
        answers: questionData.answers,
        correctAnswer: questionData.correctAnswer
      });
      alert('Question modified successfully');
      setShowQuestion(false);
      setAction(null);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error modifying question', error);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      // await axios.delete(`http://localhost:8000/api/questions/${selectedQuestion.id}/delete/`);
      await axios.delete(`${apiUrl}/api/questions/${selectedQuestion.id}/delete/`);
      alert('Question deleted successfully');
      setAction(null);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error deleting question', error);
    }
  };


  return (
    
      
      <div className="form-container">
        <div style={{textAlign:"center", fontWeight:"bold"}}> Question Search</div>
        <div className="form-grid">

        {/* Filters for Level and Category */}
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
      

      {/* List of Questions */}
      <h3>Question List</h3>
      <div className="list-header">
          <span className="id-col">ID</span>
          <span className="question-col">Question</span>
          <span style={{flex:2, textAlign:'center'}}>Action</span>
        </div>
      <ul className="scrollable-list">
        {questions.map((question) => (
          <li key={question.question_id} className="question_item">
            <span className="id-col">{question.question_id}</span> 
            <span className="question-col">{question.question_text}</span>
            <span style={{flex:2}}>
              <button className="add_remove_button" onClick={() => handleView(question)}>View</button>
              <button className="add_remove_button" onClick={() => handleModify(question)}>Modify</button>
              <button className="add_remove_button" onClick={() => handleDelete(question)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>

      {/* Show Question Form or Details */}
      {showQuestion && (
        <div className="form-container">
          <div className="form-grid">
            {/* Question Level */}
            {action === 'modify' && (
            <div className="form-row">
              <label htmlFor="questionLevel">Question Level</label>
              <select
                id="questionLevel"
                name="questionLevel"
                value={questionData.questionLevel}
                onChange={handleInputChange}
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
            )}

            {/* Question Input */}
            <div className="form-row">
              <label htmlFor="questionInput">Question Input</label>
              <textarea
                id="questionInput"
                name="questionInput"
                value={questionData.questionInput}
                onChange={handleInputChange}
                placeholder="Please type question here"
                rows="5"
                readOnly={action === 'view'}
              />
              <input type="file" name="questionImage" id="questionImage" />
            </div>

            {/* Question Category */}
            {action === 'modify' && (
            <div className="form-row">
              <label>Question Category</label>
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="questionCategory"
                    value="Trigonometry"
                    checked={questionData.questionCategory === 'Trigonometry'}
                    onChange={handleInputChange}
                    disabled={action === 'view'}
                  />
                  Trigonometry
                </label>
                <label>
                  <input
                    type="radio"
                    name="questionCategory"
                    value="Arithmetic"
                    checked={questionData.questionCategory === 'Arithmetic'}
                    onChange={handleInputChange}
                    disabled={action === 'view'}
                  />
                  Arithmetic
                </label>
                <label>
                  <input
                    type="radio"
                    name="questionCategory"
                    value="Geometry"
                    checked={questionData.questionCategory === 'Geometry'}
                    onChange={handleInputChange}
                    disabled={action === 'view'}
                  />
                  Geometry
                </label>
                <label>
                  <input
                    type="radio"
                    name="questionCategory"
                    value="Algebra"
                    checked={questionData.questionCategory === 'Algebra'}
                    onChange={handleInputChange}
                    disabled={action === 'view'}
                  />
                  Algebra
                </label>
                <label>
                  <input
                    type="radio"
                    name="questionCategory"
                    value="Calculus"
                    checked={questionData.questionCategory === 'Calculus'}
                    onChange={handleInputChange}
                    disabled={action === 'view'}
                  />
                  Calculus
                </label>
              </div>
            </div>
            )}

            {/* Answer Type */}
            <div className="form-row">
              <label>Answer Type</label>
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="ansType"
                    value="textbox"
                    checked={questionData.ansType === 'textbox'}
                    onChange={handleInputChange}
                    disabled={action !== 'modify'}
                  />
                  Textbox
                </label>
                <label>
                  <input
                    type="radio"
                    name="ansType"
                    value="single_choice"
                    checked={questionData.ansType === 'single_choice'}
                    onChange={handleInputChange}
                    disabled={action !== 'modify'}
                  />
                  Single Choice
                </label>
                <label>
                  <input
                    type="radio"
                    name="ansType"
                    value="multiple_choice"
                    checked={questionData.ansType === 'multiple_choice'}
                    onChange={handleInputChange}
                    disabled={action !== 'modify'}
                  />
                  Multiple Choice
                </label>
              </div>
            </div>

            {/* Render Answer Options Dynamically */}
            {(questionData.ansType === 'single_choice' || questionData.ansType === 'multiple_choice') && (
              <div className="form-row">
                <label>Answer Options</label>
                {questionData.answers.map((answer, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name={`answer_${index}`}
                      value={questionData.answers[index]}
                      onChange={(e) => {
                        // Update the correct answer when the input changes
                        const updatedAnswers = [...questionData.answers];
                        updatedAnswers[index] = e.target.value;
                        setQuestionData(prevData => ({
                          ...prevData,
                          answers: updatedAnswers
                        }));
                      }}
                      placeholder={`Answer Option ${index + 1}`}
                      readOnly={action === 'view'}
                    />
                  </div>
                ))}
                {action !== 'view' && (
                <button className="add-button" onClick={handleAddAnswerOption}>
                  Add Answer Option
                </button>
                )}
              </div>
            )}

            {/* Correct Answer Input */}
            <div className="form-row">
              <label htmlFor="correctAnswer">Correct Answer</label>
              <textarea
                id="correctAnswer"
                name="correctAnswer"
                value={questionData.correctAnswer}
                onChange={handleInputChange}
                placeholder="Please type correct answer here"
                rows="3"
                readOnly={action === 'view'}
              />
            </div>
            <div className="button-group">
            {action === 'modify' && (
            <button className="button" onClick={handleConfirmModify}>Confirm Modify</button>
            )}
            </div>
          </div>
        </div>
      )}     

      {/* Confirmation for Deletion */}
      {action === 'delete' && (
        <div>
          <p>Are you sure you want to delete this question?</p>
          <button onClick={handleConfirmDelete}>Yes</button>
          <button onClick={() => setAction(null)}>No</button>
        </div>
      )}
      

       
    </div>



        </div>
    
  );
};

export default QuestionSearch;
