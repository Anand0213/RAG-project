import React, { useEffect, useState } from 'react';
import './ProfessorDashboard.css';

function ProfessorDashboard({ handleLogout, username }) {
  const [syllabiList, setSyllabiList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(""); // State for PDF URL
  const [showPdfViewer, setShowPdfViewer] = useState(false); // State for controlling PDF viewer visibility
  const [newSyllabus, setNewSyllabus] = useState({
    course_id: "",
    course_name: "",
    department_id: "",
    department_name: "",
    syllabus_name: "",
    created_by: username,
    file: null,
  });

  // Function to fetch syllabi from the backend
  const fetchSyllabi = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_syllabus');
      const data = await response.json();
      if (response.ok) {
        const formattedSyllabi = data.map(syllabus => ({
          ...syllabus,
          _id: syllabus._id.toString(),
        }));
        setSyllabiList(formattedSyllabi);
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
    fetchSyllabi();
  }, []);

  // Handle new syllabus submission
  const handleNewSyllabusSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('created_by', username);
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
        fetchSyllabi();
        setNewSyllabus({
          course_id: "",
          course_name: "",
          department_id: "",
          department_name: "",
          syllabus_name: "",
          created_by: username,
          file: null,
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

  // Handle viewing a syllabus PDF
  const handleViewSyllabus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/view_syllabus/pdf/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setShowPdfViewer(true); // Show the PDF viewer
      } else {
        const data = await response.json();
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching the syllabus PDF.");
      setSuccessMessage("");
    }
  };

  // Handle closing the PDF viewer
  const handleClosePdfViewer = () => {
    setPdfUrl(""); // Clear the PDF URL
    setShowPdfViewer(false); // Hide the PDF viewer
  };

  // Handle deleting a syllabus
  const handleDeleteSyllabus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_syllabus/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccessMessage("Syllabus deleted successfully!");
        setErrorMessage("");
        fetchSyllabi();
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
            <div className="syllabus-card" key={syllabus._id}>
              <h4>{syllabus.syllabus_name}</h4>
              <p>Course ID: {syllabus.course_id}</p>
              <p>Course Name: {syllabus.course_name}</p>
              <p>Department: {syllabus.department_name}</p>
              <p>Created By: {syllabus.created_by}</p>
              <button onClick={() => handleViewSyllabus(syllabus._id)}>View PDF</button>
              <button onClick={() => handleDeleteSyllabus(syllabus._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No syllabi found.</p>
        )}
      </div>

      {showPdfViewer && (
        <div className="pdf-viewer">
          <h3>PDF Viewer</h3>
          <button onClick={handleClosePdfViewer} className="close-button">Close</button>
          <iframe src={pdfUrl} width="100%" height="600px" title="PDF Viewer"></iframe>
        </div>
      )}
    </div>
  );
}

export default ProfessorDashboard;
