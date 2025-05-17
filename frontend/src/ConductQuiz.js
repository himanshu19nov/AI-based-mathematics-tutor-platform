import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './styles/ConductQuiz.css';
import QuizSetup from './QuizSetup';
import QuestionSearch from './QuestionSearch';
import QuizSearch from './QuizSearch';
import axios from 'axios';

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showQuizSetup, setShowQuizSetup] = useState(false);
  const [showQuestionSearch, setShowQuestionSearch] = useState(false);
  const [showQuizSearch, setShowQuizSearch] = useState(false);
  const [formData, setFormData] = useState({
    // username: 'HARDCODED-username',
    username: '',
    difficulty_level: '',
    category: '',
    question_text: '',  
    ansType: '',  // Initialize ansType as an empty string
    answers: Array(3).fill(''),  // Create an array to hold answers for 10 fields
    correct_answer: '',
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFormData(prev => ({
          ...prev,
          username: decoded.username || '',
        }));
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the name starts with 'answer', update the corresponding answer option
    if (name.startsWith('answer')) {
      const index = parseInt(name.split('_')[1], 10);
      const updatedAnswers = [...formData.answers];
      updatedAnswers[index] = value;
      setFormData({ ...formData, answers: updatedAnswers });
    } else {
      // Update other fields (question level, input, category, etc.)
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleQuestionSetup = () => {
    setShowForm(true);
    setShowQuizSetup(false);
    setShowQuestionSearch(false);
    setShowQuizSearch(false);
  };

  const handleQuizSetup = () => {
    setShowQuizSetup(true); // Show quiz setup form
    setShowForm(false); // Hide question form if it's visible
    setShowQuestionSearch(false);
    setShowQuizSearch(false);
  };

  const handleQuestionSearch = () => {
    setShowForm(false); 
    setShowQuizSetup(false); 
    setShowQuestionSearch(true);
    setShowQuizSearch(false);
  };

  const handleQuizSearch = () => {
    setShowForm(false); 
    setShowQuizSetup(false); 
    setShowQuestionSearch(false);
    setShowQuizSearch(true);
  };

  const handleAddAnswerOption = () => {
    // Add a new empty answer option
    setFormData({ ...formData, answers: [...formData.answers, ''] });
  };

  const handleResetAll = () => {
    // Reset all fields to their initial empty states
    setFormData(prev => ({
      ...prev,
      difficulty_level: '',
      question_text: '',
      category: '',
      answerType: '',  // Reset answerType
      answers: Array(3).fill(''),  // Reset answers array to empty strings
      correct_answer: '',
    }));
  };

  const handleSubmit = async () => {
    // validation check
    if (!formData.difficulty_level) {
      alert('Please select a difficulty level.');
      return;
    }
    if (!formData.category) {
      alert('Please select a category.');
      return;
    }
    if (!formData.question_text.trim()) {
      alert('Please enter the question text.');
      return;
    }
    if (!formData.ansType) {
      alert('Please select an answer type.');
      return;
    }
    if (
      (formData.ansType === 'single_choice' || formData.ansType === 'multiple_choice') &&
      formData.answers.filter(ans => ans.trim()).length < 2
    ) {
      alert('Please enter at least two answer options.');
      return;
    }
    if (!formData.correct_answer.trim()) {
      alert('Please enter the correct answer.');
      return;
    }

    try {
      // const response = await axios.post('http://localhost:8000/api/create_question/', formData);
      const response = await axios.post(`${apiUrl}/api/create_question/`, formData);
      console.log('Backend Response:', response.data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Error submitting the form');
    }
  };



  const handleAIGenerate = async() => {

    // validation check
    if (!formData.difficulty_level) {
      alert('Please select a difficulty level.');
      return;
    }
    if (!formData.category) {
      alert('Please select a category.');
      return;
    }

    setLoading(true); 


    try {
      const response = await fetch(`${apiUrl}/api/create_question_ai/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed (e.g., JWT)
        },
        body: JSON.stringify({
          category: formData.category,
          difficulty: formData.difficulty_level,
          // level: 'Year 8' // Optional; adjust if you collect it from user
        })
      });

      const data = await response.json();

      if (response.status === 502) {
        alert('AI is temporarily unavailable. Please try again shortly.');
        return;
      }

      if (!response.ok) {
        console.error('AI error:', data);
        alert(data.error || 'AI generation failed.');
        return;
      }

      // Fill formData with AI-generated content
      setFormData(prev => ({
        ...prev,
        question_text: data.question.question_text,
        correct_answer: data.question.correct_answer,
        answers: [
          ...(data.question.answers || []), // Add empty strings if fewer than 10
          '', '', '', '', '', '', ''
        ].slice(0, 10),
        ansType: 'single_choice'
      }));
    } catch (err) {
      console.error('Error calling AI:', err);
      alert('Something went wrong while generating the question.');
    } finally {
    setLoading(false); // 🔓 Re-enable button
    }
  };

  return (
    <div className="app">
      <div className="button-container">
        <button className="button" onClick={handleQuestionSetup}>
          Question Setup
        </button>
        <button className="button" onClick={handleQuizSetup}>Quiz Setup</button>
        <button className="button" onClick={handleQuestionSearch}>Question Search</button>
        <button className="button" onClick={handleQuizSearch}>Quiz Publish</button>
      </div>

      {showForm && (
        <div className="form-container">
          <div style={{textAlign:"center", fontWeight:"bold"}}> Question Setup</div>
          <div className="form-grid">
            {/* Question Level */}
            <div className="form-row">
              <label htmlFor="difficulty_level">Question Level</label>
              <select
                id="difficulty_level"
                name="difficulty_level"
                value={formData.difficulty_level}
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

            {/* Question Category */}
            <div className="form-row">
              <label>Question Category</label>
              <div className="radio-buttons category-grid">
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Trigonometry"
                    checked={formData.category === 'Trigonometry'}
                    onChange={handleInputChange}
                  />
                  Trigonometry
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Arithmetic"
                    checked={formData.category === 'Arithmetic'}
                    onChange={handleInputChange}
                  />
                  Arithmetic
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Geometry"
                    checked={formData.category === 'Geometry'}
                    onChange={handleInputChange}
                  />
                  Geometry
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Algebra"
                    checked={formData.category === 'Algebra'}
                    onChange={handleInputChange}
                  />
                  Algebra
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Calculus"
                    checked={formData.category === 'Calculus'}
                    onChange={handleInputChange}
                  />
                  Calculus
                </label>
              </div>
            </div>

            {/* AI Question button */}
            <div className="ai-generate-container">
                <label className="AI-label">Select Level and Category to generate Question</label>
                {/* AI Generate Button */}

                <button className="ai-button" onClick={handleAIGenerate} disabled={loading}>
                  {loading ? 'Generating...' : 'AI Generate'}
                </button>
                
            </div>


            {/* Question Input */}
            <div className="form-row">
              <label htmlFor="question_text">Question Input</label>
              <textarea
                id="question_text"
                name="question_text"
                value={formData.question_text}
                onChange={handleInputChange}
                placeholder="Please type question here"
                rows="5"
              />
              {/* <input type="file" name="questionImage" id="questionImage" /> */}
            </div>

                        {/* Correct Answer Input */}
            <div className="form-row">
              <label htmlFor="correct_answer">Correct Answer</label>
              <textarea
                id="correct_answer"
                name="correct_answer"
                value={formData.correct_answer}
                onChange={handleInputChange}
                placeholder="Please type correct answer here"
                rows="3"
              />
              
            </div>

            {/* Answer Type */}
            <div className="form-row">
              <label>Answer Type</label>
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="ansType"
                    value="textbox"
                    checked={formData.ansType === 'textbox'}
                    onChange={handleInputChange}
                  />
                  Textbox
                </label>
                <label>
                  <input
                    type="radio"
                    name="ansType"
                    value="single_choice"
                    checked={formData.ansType === 'single_choice'}
                    onChange={handleInputChange}
                  />
                  Single Choice
                </label>
                <label>
                  <input
                    type="radio"
                    name="ansType"
                    value="multiple_choice"
                    checked={formData.ansType === 'multiple_choice'}
                    onChange={handleInputChange}
                  />
                  Multiple Choice
                </label>
              </div>
            </div>

            {/* Render answer fields dynamically based on ansType */}
            {(formData.ansType === 'single_choice' || formData.ansType === 'multiple_choice') && (
              <div className="form-row">
                <label>Answer Options</label>
                {formData.answers.map((answer, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name={`answer_${index}`}
                      value={formData.answers[index]}
                      onChange={handleInputChange}
                      placeholder={`Answer Option ${index + 1}`}
                    />
                  </div>
                ))}
                <button className="add-button" onClick={handleAddAnswerOption}>Add Answer Option</button>
              </div>
            )}

            <div className="form-row">
              <div className="button-group">

                {/* Reset All Button */}
                <button className="button" onClick={handleResetAll}>
                  Reset All
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-row">
              <div className="button-group">
                <button className="button" onClick={handleSubmit}>
                  Create Question
                </button>
                <p> </p>
                <p> </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Quiz Setup*/}
      {showQuizSetup && (
        <QuizSetup />
      )}

      {/* Question Search*/}
      {showQuestionSearch && (
        <QuestionSearch />
      )}

      {/* Quiz Search*/}
      {showQuizSearch && (
        <QuizSearch />
      )}


    </div>
  );
};

export default App;
