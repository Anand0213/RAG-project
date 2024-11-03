import React, { useState } from 'react';
import './App.css';
import Welcome from './components/Welcome/Welcome';
import StudentLogin from './components/StudentLogin/StudentLogin';
import ProfessorLogin from './components/ProfessorLogin/ProfessorLogin';
import StudentDashboard from './components/StudentDashboard/StudentDashboard';
import ProfessorDashboard from './components/ProfessorDashboard/ProfessorDashboard'; // Import the Professor Dashboard component

function App() {
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState("welcome");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  // Navigation functions
  const navigateToStudent = () => setPage("studentLogin");
  const navigateToProfessor = () => setPage("professorLogin");
  const navigateBack = () => setPage("welcome");
  const handleLogout = () => {
    setUserData(null);
    setPage("welcome");
  };

  // Handlers for user login
  const handleUserLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/login_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setSuccessMessage("Login successful!");
        setErrorMessage("");

        // Redirect based on user type
        if (data.user.userType === "professor") {
          setPage("professorDashboard"); // Navigate to Professor Dashboard
        } else {
          setPage("studentDashboard"); // Navigate to Student Dashboard
        }
      } else {
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  // Handler for user registration
  const handleUserRegistration = async (newUserData) => {
    try {
      const response = await fetch('http://localhost:5000/register_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful!");
        setErrorMessage("");
        setLoginDetails({ email: newUserData.email, password: newUserData.password });

        // Navigate to the appropriate login page based on userType
        if (newUserData.userType === "professor") {
          setPage("professorLogin");
        } else {
          setPage("studentLogin");
        }
      } else {
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="App">
      {page === "welcome" && (
        <Welcome 
          navigateToStudent={navigateToStudent} 
          navigateToProfessor={navigateToProfessor} 
        />
      )}
      {page === "studentLogin" && (
        <StudentLogin
          handleUserLogin={handleUserLogin}
          handleUserRegistration={handleUserRegistration}
          errorMessage={errorMessage}
          successMessage={successMessage}
          navigateBack={navigateBack}
          loginDetails={loginDetails}
        />
      )}
      {page === "professorLogin" && (
        <ProfessorLogin
          handleUserLogin={handleUserLogin}
          handleUserRegistration={handleUserRegistration}
          errorMessage={errorMessage}
          successMessage={successMessage}
          navigateBack={navigateBack}
          loginDetails={loginDetails}
        />
      )}
      {page === "studentDashboard" && <StudentDashboard user={userData} handleLogout={handleLogout} />}
      {page === "professorDashboard" && <ProfessorDashboard user={userData} handleLogout={handleLogout} />} {/* Add Professor Dashboard */}
    </div>
  );
}

export default App;
