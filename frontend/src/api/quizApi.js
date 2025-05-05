import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
// example apiUrl = http://13.000.00.03:8000/api

export const fetchQuestions = (quizName, quizLevel) => {
    return axios.get(`${apiUrl}/list_questions/?quizName=${quizName}&quizLevel=${quizLevel}`);
};

export const submitQuiz = (submissionData) => {
    return axios.post(`${apiUrl}/submit_quiz`, submissionData);
};

export const retryQuiz = (retryData) => {
    return axios.post("http://localhost:5000/quiz/retry", retryData);
};
