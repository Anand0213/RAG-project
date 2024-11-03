import React from 'react';
import './Welcome.css';

function Welcome({ navigateToStudent, navigateToProfessor }) {
  return (
    <div className="welcome">
      <h1>Welcome to Syllabus ChatBot</h1>
      <button onClick={navigateToStudent}>I am Student</button>
      <button onClick={navigateToProfessor}>I am Professor</button>
    </div>
  );
}

export default Welcome;
