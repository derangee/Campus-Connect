import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Request from './pages/request';
import Profile from './pages/profile';
import About from './pages/about';
import Feedback from './pages/feedback';
import Active_request from './pages/active_request';
import Home from './pages/home';



function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/request" element={<Request />} />
        <Route path="/requests" element={<Active_request />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
