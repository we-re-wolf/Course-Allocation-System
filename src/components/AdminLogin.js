import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [key, setKey] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, key }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/admin-dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Key:
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
