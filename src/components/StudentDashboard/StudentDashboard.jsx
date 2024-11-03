import React from 'react';
import './StudentDashboard.css';

function StudentDashboard({ user, handleLogout }) {
  return (
    <div className="home">
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>User Type: {user.userType}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StudentDashboard;
