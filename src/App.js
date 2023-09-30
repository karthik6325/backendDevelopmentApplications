import './App.css';
import Login from './pages/login/login';
import Chat from './pages/chat/chat';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" exact element={<Login/>} />
      <Route path="/chat" element={<Chat/>} />
      </Routes>
    </Router>
  );
}

export default App;
