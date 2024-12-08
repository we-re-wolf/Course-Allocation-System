import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FacultyForm.css";

const FacultyForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [username, setUsername] = useState("");
  const [key, setKey] = useState("");
  const [school, setSchool] = useState("");
  const [subSchool, setSubSchool] = useState("");
  const navigate = useNavigate();

  const subSchools = {
    "Faculty of Engineering": [
      "School of Design",
      "School of Core Engineering",
      "Yogananda School of AI, Computers and Data Science",
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name && designation && username && key && school && (!subSchools[school] || subSchool)) {
      try {
        const response = await fetch("http://localhost:5000/api/validate-faculty", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, key, name, designation }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("facultyUsername", username);

          onSubmit({ name, designation, school, subSchool });
          navigate("/courses");
        } else {
          alert(data.message); 
        }
      } catch (error) {
        console.error("Error validating faculty:", error);
        alert("Server error. Please try again later.");
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };

  return (
    <div className="faculty-form">
      <h2>Faculty Details</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </label>

        <label>
          Key:
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your key"
            required
          />
        </label>

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </label>

        <label>
          Designation:
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          >
            <option value="">Select Designation</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Teaching/Research Associate">Teaching/Research Associate</option>
          </select>
        </label>

        <label>
          School:
          <select
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          >
            <option value="">Select School</option>
            <option value="Faculty of Engineering">Faculty of Engineering</option>
            <option value="Faculty of Liberal Arts, Legal Sciences and Basic Sciences">
              Faculty of Liberal Arts, Legal Sciences and Basic Sciences
            </option>
            <option value="Faculty of Pharmacy">Faculty of Pharmacy</option>
            <option value="Faculty of Management Studies">Faculty of Management Studies</option>
            <option value="Faculty of Agriculture">Faculty of Agriculture</option>
            <option value="Faculty of Biotechnology">Faculty of Biotechnology</option>
          </select>
        </label>

        {school === "Faculty of Engineering" && (
          <label>
            Sub School:
            <select
              value={subSchool}
              onChange={(e) => setSubSchool(e.target.value)}
              required
            >
              <option value="">Select Sub School</option>
              {subSchools[school]?.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </label>
        )}

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default FacultyForm;
