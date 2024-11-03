import React, { useEffect, useState } from 'react';
import './ProfessorDashboard.css';

function ProfessorDashboard({ handleLogout, username }) {
  const [syllabiList, setSyllabiList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [newSyllabus, setNewSyllabus] = useState({
    course_id: "",
    course_name: "",
    department_id: "",
    department_name: "",
    syllabus_name: "",
    created_by: username, // Set created by to the professor's username
    file: null,
  });

  // Function to fetch syllabi from the backend
  const fetchSyllabi = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_syllabus');
      const data = await response.json();
      if (response.ok) {
        setSyllabiList(data); // Assuming data is an array of syllabi
        setSuccessMessage("Syllabi fetched successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching syllabi.");
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    fetchSyllabi(); // Fetch syllabi when the component mounts
  }, []);

  // Handle new syllabus submission
  const handleNewSyllabusSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in newSyllabus) {
      formData.append(key, newSyllabus[key]);
    }

    try {
      const response = await fetch('http://localhost:5000/add_syllabus', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("Syllabus added successfully!");
        setErrorMessage("");
        fetchSyllabi(); // Refresh the syllabus list
        setNewSyllabus({ 
          course_id: "", 
          course_name: "", 
          department_id: "", 
          department_name: "", 
          syllabus_name: "", 
          created_by: username, // Reset to professor's username
          file: null 
        });
      } else {
        const data = await response.json();
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the syllabus.");
      setSuccessMessage("");
    }
  };

  // Handle deleting a syllabus
  const handleDeleteSyllabus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_syllabus/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccessMessage("Syllabus deleted successfully!");
        setErrorMessage("");
        fetchSyllabi(); // Refresh the syllabus list
      } else {
        const data = await response.json();
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred while deleting the syllabus.");
      setSuccessMessage("");
    }
  };

  const handleQuestionSubmit = async () => {
    // Your implementation for handling question submission to chat
    // For example, send the selected syllabus and question to the backend
    // Set chatResponse based on the backend response
  };

  return (
    <div className="professor-dashboard">
      <h2>Welcome, Professor!</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Add Syllabus</h3>
      <form onSubmit={handleNewSyllabusSubmit}>
        <input
          type="text"
          placeholder="Course ID"
          value={newSyllabus.course_id}
          onChange={(e) => setNewSyllabus({ ...newSyllabus, course_id: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Course Name"
          value={newSyllabus.course_name}
          onChange={(e) => setNewSyllabus({ ...newSyllabus, course_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Department ID"
          value={newSyllabus.department_id}
          onChange={(e) => setNewSyllabus({ ...newSyllabus, department_id: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Department Name"
          value={newSyllabus.department_name}
          onChange={(e) => setNewSyllabus({ ...newSyllabus, department_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Syllabus Name"
          value={newSyllabus.syllabus_name}
          onChange={(e) => setNewSyllabus({ ...newSyllabus, syllabus_name: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => setNewSyllabus({ ...newSyllabus, file: e.target.files[0] })}
          required
        />
        <button type="submit">Add Syllabus</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <h3>Uploaded Syllabi</h3>
      <div className="syllabi-list">
        {syllabiList.length > 0 ? (
          syllabiList.map((syllabus) => (
            <div className="syllabus-card" key={syllabus.id}>
              <h4>{syllabus.course_name}</h4>
              <p>Course ID: {syllabus.course_id}</p>
              <p>Department: {syllabus.department_name}</p>
              <p>Created By: {syllabus.created_by}</p>
              <button onClick={() => setSelectedSyllabus(syllabus)}>View</button>
              <button onClick={() => handleDeleteSyllabus(syllabus.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No syllabi found.</p>
        )}
      </div>

      {selectedSyllabus && (
        <div className="question-section">
          <h3>Ask a Question about {selectedSyllabus.course_name}</h3>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Your question"
          />
          <button onClick={handleQuestionSubmit}>Submit</button>
          <p>{chatResponse}</p>
        </div>
      )}
    </div>
  );
}

export default ProfessorDashboard;
