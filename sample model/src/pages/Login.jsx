// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    alert("Login successful!");
    localStorage.setItem("currentUser", JSON.stringify(user)); // store the logged-in user
    localStorage.setItem("role", user.role); // for protected routing

    if (user.role === "user") navigate("/user");
    else if (user.role === "owner") navigate("/owner");
  } else {
    alert("Invalid credentials");
  }
};


  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}