// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  // Your global styles
import App from './App';  // Main app component
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter to handle routing

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>  {/* Wrap the whole app in BrowserRouter to enable routing */}
    <App />
  </BrowserRouter>
);
