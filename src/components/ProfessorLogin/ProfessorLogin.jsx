import React, { useState } from 'react';
import './ProfessorLogin.css';

function ProfessorLogin({ handleUserLogin, handleUserRegistration, errorMessage, successMessage, navigateBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (isRegistering) {
      if (username.length < 3) {
        setFormError("Username must be at least 3 characters long!");
        return;
      }

      if (!validateEmail(email)) {
        setFormError("Invalid email format!");
        return;
      }

      if (password !== confirmPassword) {
        setFormError("Passwords do not match!");
        return;
      }

      if (!validatePassword(password)) {
        setFormError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
        );
        return;
      }

      

      const newUserData = {
        username: username.trim(),
        email: email.trim(),
        password,
        userType: "professor",
      };
      handleUserRegistration(newUserData);
    } else {
      if (!email || !password) {
        setFormError("Please fill in both email and password!");
        return;
      }

      handleUserLogin(email.trim(), password);
    }
  };

  return (
    <div className="professor-login">
      <div className="back-icon" onClick={navigateBack}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M19 11H7.83l5.59-5.59L13 4l-8 8 8 8 1.41-1.41L7.83 13H19z" />
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
        <div className="password-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>
        {isRegistering && (
          <div className="password-container">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              {confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
        )}
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>
      <div className="toggle-button-container">
        <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Back to Login" : "New User? Register"}
        </button>
      </div>
      {formError && <p className="error-message">{formError}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default ProfessorLogin;
