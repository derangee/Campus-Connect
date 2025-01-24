/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import Request from "./pages/request";
import Profile from "./pages/Profile"
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Active_request from "./pages/Active_request";
import Home from "./pages/home";
import React from "react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/request" element={<Request />} />
      <Route path="/requests" element={<Active_request />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
}

export default App;
