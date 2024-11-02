import React, { useState } from 'react';
import './ProfessorLogin.css';

function ProfessorLogin({ handleUserLogin, handleUserRegistration, errorMessage, successMessage, navigateBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistering) {
      if (password !== confirmPassword) {
        return alert("Passwords do not match!");
      }
      const newUserData = {
        username: username.trim(),
        email: email.trim(),
        password,
        userType: "professor"
      };
      handleUserRegistration(newUserData);
    } else {
      handleUserLogin(email.trim(), password);
    }
  };

  return (
    <div className="professor-login">
      <div className="back-icon" onClick={navigateBack}>
        {/* SVG icon for back */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M15.75 18L10.5 12l5.25-6H9V3h9v3h-5.25z"/>
        </svg>
      </div>
      <h2>{isRegistering ? "Professor Registration" : "Professor Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        )}
        <input 
          type="text" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {isRegistering && (
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        )}
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Back to Login" : "New User? Register"}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default ProfessorLogin;
