import React, { useState } from 'react';
import './RegisterPage.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const RegisterPage = () => {
  const [role, setRole] = useState('user'); // Default role is "user"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ngoName: '',
    registrarName: '',
    volunteerNgo: '',
    password: '',
    confirmPassword: ''
  });

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Volunteer verification logic
      if (role === "volunteer") {
        const ngo = formData.volunteerNgo;
        const volunteersRef = collection(db, "ngos", ngo, "volunteers");
        const snapshot = await getDocs(volunteersRef);

        let isVerified = false;
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (
            (data.email && data.email.toLowerCase() === formData.email.toLowerCase()) ||
            (data.name && data.name.toLowerCase() === formData.name.toLowerCase())
          ) {
            isVerified = true;
          }
        });

        if (!isVerified) {
          alert("You are not authorized to register. Ask your NGO to add you first.");
          return;
        }
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Prepare user data for Firestore
      const userData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: role,
      };

      if (role === "ngo") {
        userData.ngoName = formData.ngoName;
        userData.registrarName = formData.registrarName;
      } else if (role === "volunteer") {
        userData.volunteerNgo = formData.volunteerNgo;
      }

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      alert("Registered successfully!");

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        ngoName: '',
        registrarName: '',
        volunteerNgo: '',
        password: '',
        confirmPassword: ''
      });
      setRole('user');
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message);
    }
  };

  return (
    <div className="register-container">
      <header>
        <h1>Register as <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span></h1>
      </header>

      <section className="section">
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="role-selection">
            <label>
              <input
                type="radio"
                value="ngo"
                checked={role === 'ngo'}
                onChange={handleRoleChange}
              />
              NGO
            </label>
            <label>
              <input
                type="radio"
                value="volunteer"
                checked={role === 'volunteer'}
                onChange={handleRoleChange}
              />
              Volunteer
            </label>
            <label>
              <input
                type="radio"
                value="donor"
                checked={role === 'donor'}
                onChange={handleRoleChange}
              />
              Donor
            </label>
          </div>

          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* NGO Fields */}
          {role === 'ngo' && (
            <>
              <div className="form-group">
                <label htmlFor="ngoName">NGO Name:</label>
                <input
                  type="text"
                  id="ngoName"
                  value={formData.ngoName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="registrarName">Registrar Name:</label>
                <input
                  type="text"
                  id="registrarName"
                  value={formData.registrarName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {/* Volunteer Fields */}
          {role === 'volunteer' && (
            <div className="form-group">
              <label htmlFor="volunteerNgo">Select NGO:</label>
              <select
                id="volunteerNgo"
                value={formData.volunteerNgo}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select an NGO</option>
                <option value="Helping Hands">Helping Hands</option>
                <option value="Food for All">Food for All</option>
                <option value="Zero Hunger">Zero Hunger</option>
              </select>
            </div>
          )}

          {/* Password Fields */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn">Register</button>
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;