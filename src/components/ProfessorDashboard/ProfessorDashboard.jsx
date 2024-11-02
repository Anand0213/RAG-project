import React from 'react';
import './ProfessorDashboard.css';

function ProfessorDashboard({ handleLogout, syllabiList, handleView, handleSubmit, handleChange, handleFileChange, selectedSyllabus, setSelectedSyllabus, handleQuestionSubmit, question, setQuestion, chatResponse, errorMessage, successMessage }) {
  return (
    <div className="professor-dashboard">
      <h2>Welcome, Professor!</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>Add Syllabus</h3>
      <form onSubmit={handleSubmit}>
        <input name="course_id" placeholder="Course ID" onChange={handleChange} required />
        <br />
        <input name="course_name" placeholder="Course Name" onChange={handleChange} required />
        <br />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <br />
        <input type="file" onChange={handleFileChange} required />
        <br />
        <button type="submit">Submit</button>
      </form>
      <h3>Uploaded Syllabi</h3>
      <ul>
        {syllabiList.map((syllabus, index) => (
          <li key={index}>
            {syllabus.course_name} - {syllabus.course_id}
            <button onClick={() => handleView(syllabus)}>View</button>
            <button onClick={() => setSelectedSyllabus(syllabus)}>Ask a Question</button>
          </li>
        ))}
      </ul>
      {selectedSyllabus && (
        <div>
          <h3>Ask a Question about {selectedSyllabus.course_name}</h3>
          <input 
            type="text" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="Your question" 
          />
          <button onClick={handleQuestionSubmit}>Submit</button>
          <p>{chatResponse}</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default ProfessorDashboard;
