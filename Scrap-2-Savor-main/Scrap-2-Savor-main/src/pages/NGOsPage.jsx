import React, { useState, useEffect } from 'react';
import "../assets/styles/NGOsPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ngos = [
  {
    name: 'Helping Hands',
    image: '/ngo/helping_hands.png',
    info: 'Add your volunteers and make necessary arrangements for food pickup.',
  },
  {
    name: 'Robin Hood Army',
    image: '/ngo/Robin_hood_army.png',
    info: 'Serve the hungry citizens.',
  },
  {
    name: 'Hope Givers',
    image: '/ngo/hope_givers.png',
    info: 'Coordinate with volunteers for logistics and arrangements.',
  },
];

const NGOsPage = () => {
  const [ngoName, setNgoName] = useState("");
  const [volunteerData, setVolunteerData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch logged-in NGO's name from 'users' collection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged in UID:", user.uid);
        try {
          const docRef = doc(db, "users", user.uid); // <-- changed from "ngos"
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("User data from Firestore:", data);
            if (data.ngoName) {
              setNgoName(data.ngoName);
            } else {
              console.warn("No 'ngoName' field in user document.");
            }
          } else {
            console.warn("No document found for user UID in 'users'.");
          }
        } catch (err) {
          console.error("Error fetching user document:", err);
        }
      } else {
        console.warn("User not logged in.");
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setVolunteerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    const { name, email, phone } = volunteerData;

    if (!name || !email || !phone || !ngoName) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const volunteerRef = collection(db, "ngos", ngoName, "volunteers");
      await addDoc(volunteerRef, {
        name,
        email,
        phone,
        createdAt: new Date()
      });

      alert("Volunteer added successfully!");
      setVolunteerData({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding volunteer:", error);
      alert("Failed to add volunteer.");
    }
  };

  return (
    <div className="ngos-page">
      <Navbar />
      <h2 className="ngos-title">Top NGOs</h2>

      <div className="ngos-grid">
        {ngos.map((ngo, index) => (
          <div key={index} className="ngo-card">
            <img src={ngo.image} alt={ngo.name} className="ngo-image" />
            <div className="ngo-overlay">
              <h3>{ngo.name}</h3>
              <p>{ngo.info}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="volunteer-form-section">
        <h1 className="form-title">Add a Volunteer</h1>

        <form className="volunteer-form" onSubmit={handleAddVolunteer}>
          <input
            type="text"
            name="name"
            placeholder="Volunteer Name"
            value={volunteerData.name}
            onChange={handleVolunteerChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={volunteerData.email}
            onChange={handleVolunteerChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={volunteerData.phone}
            onChange={handleVolunteerChange}
            required
          />
          <input
            type="text"
            name="ngoName"
            placeholder="NGO Name"
            value={ngoName}
            readOnly
          />
          <button type="submit">Add Volunteer</button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default NGOsPage;