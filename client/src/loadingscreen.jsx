/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./index.css";
import App from "./App.jsx";
import Footer from "./components/footer.jsx";
import Navbar from "./components/navbar.jsx";
import logo from "../public/logo.png";
import { BrowserRouter as Router } from "react-router-dom";

const LoadingScreen = () => {
  const text = "SRRMAP Campus Connect...";
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setVisibleText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust the interval as needed

    return () => clearInterval(interval); // Clean up interval
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={logo} alt="University Logo" className="w-24 mb-6" />
      <p
        className="text-3xl text-gray-700 whitespace-pre"
        style={{
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {visibleText}
      </p>
    </div>
  );
};

const MainApp = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000); // Adjust the time as needed
    return () => clearTimeout(timeout);
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <Router>
      <Navbar />
      <App />
      <Footer />
    </Router>
  );
};

// Export the MainApp component for use in main.jsx
export default MainApp;
