import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FacultyForm from "./components/FacultyForm";
import CourseSelection from "./components/CourseSelection";
import ThankYou from "./components/ThankYou";
import "./styles/App.css";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Allocations from "./components/Allocations";

function App() {
  const [facultyData, setFacultyData] = React.useState(null);

  const handleFacultySubmit = (data) => {
    setFacultyData(data);
  };

  return (
    <Router>
      <div className="App">
        <h1>Course Assigner</h1>
        <Routes>
          <Route
            path="/"
            element={<FacultyForm onSubmit={handleFacultySubmit} />}
          />
          <Route
            path="/courses"
            element={
              facultyData ? (
                <CourseSelection
                  school={facultyData.school}
                  subSchool={facultyData.subSchool}
                />
              ) : (
                <p>Please complete the Faculty form first.</p>
              )
            }
          />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/allocations" element={<Allocations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
