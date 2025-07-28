import React, { useState, useEffect } from 'react';
import styles from "../assets/styles/DonorsPage.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapPicker from '../components/MapPicker';
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const DonorsPage = () => {
  const [spoilageStatus, setSpoilageStatus] = useState("✅ Acceptable");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);

    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        fetchDonations(u.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchDonations = async (uid) => {
    try {
      const db = getFirestore();
      const q = query(collection(db, "donations"), where("donorId", "==", uid));
      const querySnapshot = await getDocs(q);
      const donationList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(donationList);
    } catch (error) {
      console.error("Error fetching donations: ", error);
    }
  };

  const handleDonateClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    const db = getFirestore();
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.role === "donor") {
        alert("You're a verified donor. You can donate food.");
        document
          .querySelector(`.${styles.donationFormSection}`)
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        alert("Only users registered as donors can donate food.");
        navigate("/register");
      }
    } else {
      alert("User data not found. Please register.");
      navigate("/register");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();
    const user = auth.currentUser;

    if (!user) {
      alert("You need to log in before donating.");
      navigate("/login");
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("User data not found. Please register.");
      navigate("/register");
      return;
    }

    const userData = docSnap.data();
    if (userData.role !== "donor") {
      alert("Only registered donors can donate food.");
      navigate("/register");
      return;
    }

    const foodItem = e.target[0].value;
    const quantity = e.target[1].value;
    const manufactureDate = e.target[2].value;
    const expiryDate = e.target[3].value;
    const pickupLocationText = e.target[4].value;
    const contactNumber = e.target[5].value;
    const imageFile = e.target[6].files[0];

    let imageUrl = "";

    try {
      if (imageFile) {
        const imageRef = ref(storage, `donation_images/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const donationData = {
        foodItem,
        quantity,
        manufactureDate,
        expiryDate,
        pickupLocationText,
        contactNumber,
        pickupCoordinates: selectedLocation,
        createdAt: new Date(),
        status: "Pending",
        userId: user.uid,
        donorId: user.uid,
        imageUrl
      };

      await addDoc(collection(db, "donations"), donationData);
      alert("Thank you for your donation!");
      fetchDonations(user.uid);
    } catch (error) {
      console.error("Error saving donation:", error);
      alert("Failed to save donation. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.backgroundWrapper}>
        <div className={styles.donorsPage}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.heroOverlay}></div>
            <h1>Your extra is someone’s enough.</h1>
            <button className={styles.ctaButton} onClick={handleDonateClick}>
              Donate Now
            </button>
          </div>

          {/* Donation Form */}
          <div className={styles.donationFormSection}>
            <h2>Donate Food</h2>
            <form className={styles.donorForm} onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label>🍱 Food Item</label>
                <input type="text" placeholder="Food Item" required />
              </div>
              <div className={styles.formGroup}>
                <label>📦 Quantity (in kg)</label>
                <input type="number" placeholder="Quantity" required />
              </div>
              <div className={styles.formGroup}>
                <label>📅 Manufacture Date</label>
                <input type="date" required />
              </div>
              <div className={styles.formGroup}>
                <label>📅 Expiry Date</label>
                <input type="date" required />
              </div>
              <div className={styles.formGroup}>
                <label>📍 Pickup Location</label>
                <MapPicker setLocation={setSelectedLocation} />
                {selectedLocation && (
                  <p>
                    Selected Location: Lat {selectedLocation.lat}, Lng {selectedLocation.lng}
                  </p>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>📞 Contact Number</label>
                <input type="tel" placeholder="Contact Number" required />
              </div>
              <div className={styles.formGroup}>
                <label>📸 Upload Image</label>
                <input type="file" accept="image/*" />
              </div>
              <div className={styles.spoilageStatus}>
                Status: <span>{spoilageStatus}</span>
              </div>
              <button type="submit" className={styles.submitButton}>
                Submit Donation
              </button>
            </form>
          </div>

          {/* Donation History */}
          <div className={styles.donationHistory}>
            <h2>Your Donation History</h2>
            <div className={styles.historyCards}>
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <div key={donation.id} className={styles.historyCard}>
                    <p><strong>Item:</strong> {donation.foodItem}</p>
                    <p><strong>Quantity:</strong> {donation.quantity}</p>
                    <p><strong>Pickup:</strong> {donation.pickupLocationText}</p>
                    <p><strong>Status:</strong> {donation.status}</p>
                    <p><strong>Date:</strong> {new Date(donation.createdAt.seconds * 1000).toLocaleDateString()}</p>
                    {donation.imageUrl && (
                      <img
                        src={donation.imageUrl}
                        alt="Donation"
                        className={styles.historyImage}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>No donations made yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorsPage;