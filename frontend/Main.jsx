// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App.jsx';
import './combined-theme.css'; // Updated to use the combined theme file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
