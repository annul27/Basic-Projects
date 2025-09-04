import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Welcome from './components/Welcome.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/welcome" replace />} /> 
    </Routes>
  </BrowserRouter>,
)
  