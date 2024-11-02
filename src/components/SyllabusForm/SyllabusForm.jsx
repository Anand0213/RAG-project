import React from 'react';
import './SyllabusForm.css';

function SyllabusForm({ handleFormSubmit, handleFormChange, formData }) {
  return (
    <div className="syllabus-form">
      <h2>Syllabus Form</h2>
      <form onSubmit={handleFormSubmit}>
        <input 
          type="text" 
          name="courseName" 
          placeholder="Course Name" 
          value={formData.courseName} 
          onChange={handleFormChange} 
          required 
        />
        <br />
        <input 
          type="text" 
          name="courseCode" 
          placeholder="Course Code" 
          value={formData.courseCode} 
          onChange={handleFormChange} 
          required 
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SyllabusForm;
