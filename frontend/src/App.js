import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeFinder from "./components/RecipeFinder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Splash from "./pages/Splash";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<RecipeFinder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
