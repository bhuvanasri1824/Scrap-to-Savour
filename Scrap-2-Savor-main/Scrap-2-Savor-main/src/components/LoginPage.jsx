import React, { useState } from 'react';
import './LoginPage.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Update path if needed
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!role) {
      setErrorMessage("Please select a role to login.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
  
      if (!userDoc.exists()) {
        setErrorMessage("User data not found!");
        return;
      }
  
      const userData = userDoc.data();
  
      if (userData.role !== role) {
        setErrorMessage(`You are not registered as ${role}.`);
        return;
      }
  
      alert(`Logged in successfully as ${role}`);
      
      // Example redirects (you must create these routes)
      if (role === "ngo") navigate("/ngos");
      if (role === "donor") navigate("/donors");
      if (role === "volunteer") navigate("/volunteers");
  
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (forgotEmail.trim() === '') {
      alert('Please enter your registered email to reset password.');
    } else {
      alert(`Password reset link sent to ${forgotEmail}`);
      setShowForgotPassword(false);
      setForgotEmail('');
    }
  };

  return (
    <div className="login-page">
      <header>
        <h1>Login as <span id="role-name">{role ? role.charAt(0).toUpperCase() + role.slice(1) : '...'}</span></h1>
      </header>
      <section className="section">
        <div className="role-selection">
          <div className="role-card" onClick={() => setRole('ngo')}>Login as NGO</div>
          <div className="role-card" onClick={() => setRole('volunteer')}>Login as Volunteer</div>
          <div className="role-card" onClick={() => setRole('donor')}>Login as Donor</div>
        </div>

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label htmlFor="forgot-email">Enter Registered Email:</label>
              <input
                type="email"
                id="forgot-email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">Send Reset Link</button>
            <p className="back-to-login" onClick={() => setShowForgotPassword(false)}>Back to Login</p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">Login</button>
            <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>Forgot Password?</p>
          </form>
        )}

        {errorMessage && <p id="errorMessage" style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}
      </section>
    </div>
  );
};

export default LoginPage;