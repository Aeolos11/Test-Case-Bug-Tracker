import { useState } from 'react'

import './App.css'
import {Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

function App() {


  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>

  )
}

export default App
