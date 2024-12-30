import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import "./App.css"
import Login from './pages/Login';
import Profile from './pages/Profile';
import Create from './pages/Create';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <RouteHandler/>
      </BrowserRouter>
    </>
  )
}

const RouteHandler = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/create" element={<Create />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  )
} 

export default App