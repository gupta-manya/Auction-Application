// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
  path="/user"
  element={
    <ProtectedRoute role="user">
      <UserDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner"
  element={
    <ProtectedRoute role="owner">
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
    </Router>
  );
}

export default App;