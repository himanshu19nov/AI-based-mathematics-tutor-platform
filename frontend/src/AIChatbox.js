import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles/AIChatbox.css';  

const AIChatbox = () => {
  const [userMessage, setUserMessage] = useState('');   // Holds user input message
  const [chatHistory, setChatHistory] = useState([]);    // Holds the chat history (both user and AI messages)
  const [loading, setLoading] = useState(false);         // To show loading indicator when waiting for AI
  const chatHistoryRef = useRef(null);                   // Reference to the chat history container

  // Function to handle user message input
  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  // Function to send user message to the Django backend and get AI response
  const sendMessage = async () => {
    if (userMessage.trim() === '') return;  // Ignore empty messages

    // Update chat history with user's message
    const newChatHistory = [...chatHistory, { type: 'user', text: userMessage }];
    setChatHistory(newChatHistory);
    setUserMessage('');  // Clear the input field

    try {
      setLoading(true);  // Set loading state to true while waiting for the response

      // Send the user message to the Django backend API
      const response = await axios.post('http://localhost:8000/api/ask', { question: userMessage });
      
      const aiAnswer = response.data.answer || "Sorry, I couldn't understand your question.";

      // Update chat history with AI response
      setChatHistory([...newChatHistory, { type: 'ai', text: aiAnswer }]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setChatHistory([...newChatHistory, { type: 'ai', text: "Sorry, there was an error. Please try again." }]);
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  // Scroll to the bottom of the chat history when new messages are added
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {

    if (loading) {
        // Prevent any action if AI is typing
        e.preventDefault();
        return;
      }
    
      if (e.key === 'Enter' && !e.shiftKey) { // Enter key without Shift key
        e.preventDefault();  // Prevent new line in textarea
        sendMessage();  // Trigger message send
      }
  };


  return (
    <div className="ai-chatbox">
      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {loading && <div className="loading">AI is typing...</div>}  {/* Display loading message */}

      <div className="input-container">
        <div className="textarea-container">
          <textarea
            value={userMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows="5"
          />
          <button onClick={sendMessage} disabled={loading} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbox;
