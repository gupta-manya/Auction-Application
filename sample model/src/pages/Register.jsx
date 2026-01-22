import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  const duplicate = existingUsers.find(user => user.email === formData.email);
  if (duplicate) {
    alert("Email already registered. Please login.");
    navigate("/login");
    return;
  }

  // Save new user
  const updatedUsers = [...existingUsers, formData];
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  alert("Registered successfully! Please login.");
  navigate("/login");
};


  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="form-control mb-3"
          required
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          required
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          required
          onChange={handleChange}
        />
        <select
          name="role"
          className="form-select mb-3"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
}