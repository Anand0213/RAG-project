import React, { useState, useEffect } from 'react';
import './App.css';
import Welcome from './components/Welcome/Welcome';
import StudentLogin from './components/StudentLogin/StudentLogin';
import ProfessorLogin from './components/ProfessorLogin/ProfessorLogin';
import StudentDashboard from './components/StudentDashboard/StudentDashboard';
import ProfessorDashboard from './components/ProfessorDashboard/ProfessorDashboard';

function App() {
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState("welcome");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      // Navigate to the correct dashboard based on user type
      setPage(JSON.parse(storedUserData).userType === "professor" ? "professorDashboard" : "studentDashboard");
    }
  }, []);

  // Navigation functions
  const navigateToStudent = () => setPage("studentLogin");
  const navigateToProfessor = () => setPage("professorLogin");
  const navigateBack = () => setPage("welcome");
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('username');
    
    window.location.reload();

    // Redirect to login or welcome page
    setPage("login");
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

            // Store user data in localStorage
            localStorage.setItem('userData', JSON.stringify(data.user));
            localStorage.setItem('username', data.user.username); // Store username
            console.log(localStorage.getItem('username'))

            // Redirect based on user type
            if (data.user.userType === "professor") {
                setPage("professorDashboard");
            } else {
                setPage("studentDashboard");
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
      {page === "professorDashboard" && <ProfessorDashboard user={userData} handleLogout={handleLogout} />}
    </div>
  );
}

export default App;
