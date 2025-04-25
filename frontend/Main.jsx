// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App.jsx';
import './index.css'; // Or your custom styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
