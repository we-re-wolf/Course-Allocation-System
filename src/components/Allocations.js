import React, { useEffect, useState } from "react";
import "../styles/Allocations.css";

const Allocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [unassignedCourses, setUnassignedCourses] = useState([]);

  useEffect(() => {
    async function fetchAllocations() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/get-allocations", {
            method: "GET"
          });
        const data = await response.json();

        if (data.status === "success") {
          setAllocations(data.allocations);
          setUnassignedCourses(data.unassigned_courses);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching allocations:", error);
        alert("Failed to fetch allocations. Please try again.");
      }
    }

    fetchAllocations();
  }, []);
  const downloadCSV = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/export-allocations", {
        method: "GET",
      });
      const data = await response.json();

      if (response.ok) {
        const allocatedBlob = new Blob([data.allocated_csv], { type: "text/csv" });
        const unassignedBlob = new Blob([data.unassigned_csv], { type: "text/csv" });

        const allocatedUrl = window.URL.createObjectURL(allocatedBlob);
        const unassignedUrl = window.URL.createObjectURL(unassignedBlob);

        const allocatedLink = document.createElement("a");
        allocatedLink.href = allocatedUrl;
        allocatedLink.download = "allocated_courses.csv";
        allocatedLink.click();

        const unassignedLink = document.createElement("a");
        unassignedLink.href = unassignedUrl;
        unassignedLink.download = "unassigned_courses.csv";
        unassignedLink.click();
      } else {
        alert("Failed to download CSV files.");
      }
    } catch (error) {
      console.error("Error downloading CSV files:", error);
    }
  };

  return (
    <div className="allocations-page">
      <h1>Course Allocations</h1>

      <button onClick={downloadCSV} className="download-btn">
        Export as CSV
      </button>

      <div>
        <h2>Allocated Courses</h2>
        <table className="allocated-courses-table">
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Course Name</th>
              <th>Program</th>
              <th>Semester</th>
              <th>Credits</th>
              <th>Weekly Slots</th>
              <th>Groups</th>
              <th>Allocated Hours</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation, index) => (
              <tr key={index}>
                <td>{allocation.faculty_name}</td>
                <td>{allocation.course_name}</td>
                <td>{allocation.program}</td>
                <td>{allocation.semester}</td>
                <td>{allocation.credits}</td>
                <td>{allocation.weekly_slots}</td>
                <td>{allocation.groups}</td>
                <td>{allocation.allocated_hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Unassigned Courses</h2>
        <table className="unassigned-courses-table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Semester</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Weekly Slots</th>
              <th>Groups</th>
            </tr>
          </thead>
          <tbody>
            {unassignedCourses.map((course, index) => (
              <tr key={index}>
                <td>{course.program}</td>
                <td>{course.semester}</td>
                <td>{course.course_name}</td>
                <td>{course.credits}</td>
                <td>{course.weekly_slots}</td>
                <td>{course.groups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Allocations;
