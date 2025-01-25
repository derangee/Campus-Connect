/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import Request from "./pages/request";
import Profile from "./pages/Profile"
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Active_request from "./pages/Active_request";
import Home from "./pages/home";
import React from "react";
import Login from "./pages/login";
import Admin from "../admin/admin";
import AdminLogs from "../admin/logs";
import Chat from "./chats";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/admin/logs" element={<AdminLogs />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/request" element={<Request />} />
      <Route path="/requests" element={<Active_request />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
}

export default App;
