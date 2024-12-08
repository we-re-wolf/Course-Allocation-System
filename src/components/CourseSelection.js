import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "../styles/CourseSelection.css";

const CourseSelection = ({ school, subSchool }) => {
  const [courses, setCourses] = useState([]);
  const [preferences, setPreferences] = useState({});
  const navigate = useNavigate();

  const username = localStorage.getItem("facultyUsername");

  useEffect(() => {
    Papa.parse("/data/courses.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setCourses(results.data);
      },
      error: (error) => {
        console.error("Error loading courses:", error);
      },
    });
  }, []);

  const handlePreferenceChange = (courseIndex, preference) => {
    setPreferences((prev) => ({
      ...prev,
      [courseIndex]: preference,
    }));
  };

  const handleSubmit = async () => {
    const selectedPreferences = Object.entries(preferences)
      .filter(([, pref]) => pref)
      .map(([index, pref]) => ({
        ...courses[index],
        preference: pref,
      }));

    if (selectedPreferences.length !== 7) {
      alert("Please select exactly 7 courses with unique preferences.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/submit-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, preferences: selectedPreferences }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Preferences submitted successfully!");
        localStorage.removeItem("facultyUsername"); // Clear username after submission
        navigate("/thank-you");
      } else {
        alert(data.message || "Error submitting preferences.");
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="course-selection">
      <h2>Available Courses for {subSchool} under {school}</h2>
      {courses.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Program</th>
                <th>Semester</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Weekly Slots</th>
                <th>Groups</th>
                <th>Preference</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{course.Program}</td>
                  <td>{course.Semester}</td>
                  <td>{course["Course Name"]}</td>
                  <td>{course.Credits}</td>
                  <td>{course["Weekly Slots"]}</td>
                  <td>{course.Groups}</td>
                  <td>
                    <select
                      value={preferences[index] || ""}
                      onChange={(e) => handlePreferenceChange(index, e.target.value)}
                    >
                      <option value="">Select</option>
                      {[...Array(7)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Submit Preferences</button>
        </>
      ) : (
        <p>Loading courses...</p>
      )}
    </div>
  );
};

export default CourseSelection;
