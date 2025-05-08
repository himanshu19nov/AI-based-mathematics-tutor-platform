import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './styles/KnowledgeBase.css';

const KnowledgeBasePage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}-${hours}:${minutes}:${seconds}`;
  };
  const fileInputRef = useRef(null);
  const [entries, setEntries] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch knowledge base entries
  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/knowledge/`);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setStatusMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('title', title);

    try {
      setStatusMessage("Uploading...");
      const response = await axios.post(`${apiUrl}/api/upload_knowledge/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setStatusMessage("✅ File uploaded successfully.");
        setSelectedFile(null);
        setTitle('');
        setCategory('');
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; 
        }
        fetchEntries(); // Refresh the list
      } else {
        setStatusMessage("❌ Error uploading file.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response) {
        setStatusMessage(`❌ Upload failed: ${error.response.data.detail || 'Server error'}`);
      } else {
        setStatusMessage("❌ Upload failed: Network or CORS error.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this knowledge record?")) {
      try {
        // Send DELETE request to the API
        const response = await axios.delete(`${apiUrl}/api/knowledge/${id}/`);
        
        if (response.status === 204) {
          // Successfully deleted, now update the state to reflect changes
          setEntries(entries.filter((entry) => entry.id !== id));
          alert("✅ Knowledge record deleted successfully.");
        } else {
          alert("❌ Error deleting knowledge record.");
        }
      } catch (error) {
        console.error("Error deleting knowledge record:", error);
        alert("❌ Error deleting knowledge record. Please try again.");
      }
    }
  };

  return (
    <div className="knowledgebase-page">
      <div className="upload-container">
        <h2>Upload Document to Knowledge Base</h2>
        <label>File (.pdf or .docx)</label>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} ref={fileInputRef}/>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title (optional)"
        />

        <label>Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category (optional)"
        />

        <button onClick={handleFileUpload}>Upload</button>

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>

      <div className="entries-container">
        <h2>Knowledge Base Records</h2>
        {entries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          <table className="entry-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Title</th>
                <th>Content</th> 
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.category}</td>
                  <td>{entry.title}</td>
                  <td style={{ maxWidth: '400px', 
                    maxHeight: '4em',
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    display: '-webkit-box', 
                    whiteSpace: 'normal',
                    WebkitLineClamp: 5, 
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.2em',
                     }}>
                    {entry.content}</td>
                  <td>{formatDate(entry.created_at)}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(entry.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
