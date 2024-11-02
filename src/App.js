import React, { useState } from 'react';
import './App.css';
import Welcome from './components/Welcome/Welcome';
import StudentLogin from './components/StudentLogin/StudentLogin';
import ProfessorLogin from './components/ProfessorLogin/ProfessorLogin';
import Home from './components/Home/Home';

function App() {
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState("welcome");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  // Navigation functions
  const navigateToStudent = () => setPage("studentLogin");
  const navigateToProfessor = () => setPage("professorLogin");
  const navigateToHome = () => setPage("home");
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
        setPage("home");
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
        // Set login details for the next page
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

  const navigateBack = () => setPage("welcome");

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
          loginDetails={loginDetails} // Pass login details to StudentLogin
        />
      )}
      {page === "professorLogin" && (
        <ProfessorLogin
          handleUserLogin={handleUserLogin}
          handleUserRegistration={handleUserRegistration}
          errorMessage={errorMessage}
          successMessage={successMessage}
          navigateBack={navigateBack}
          loginDetails={loginDetails} // Pass login details to ProfessorLogin
        />
      )}
      {page === "home" && <Home user={userData} handleLogout={handleLogout} />}
    </div>
  );
}

export default App;
