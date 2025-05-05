import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchResultByUserId = async (userId) => {
  const response = await axios.get(`${apiUrl}/view_result/${userId}/`);
  return response.data;
};

export const submitEvaluation = async (payload) => {
  const response = await axios.post(`${apiUrl}/evaluate_quiz/`, payload);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios.get(`${apiUrl}/users/`);
  return response.data;
};
