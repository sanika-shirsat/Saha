import { useState } from "react";
import { db, auth } from "../firebase";
import { ref, push } from "firebase/database";
import axios from "axios";
import "../styles/animations.css";


const formatNumber = (num: string) => {
  let cleaned = num.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  return "+91" + cleaned;
};

const SOSButton = ({ guardian, location }: any) => {
  const [loading, setLoading] = useState(false);

  const isDisabled = !guardian;
 if (loading) return;

  const handleSOS = async () => {
  if (!guardian) {
    return alert("🚨 Please add a guardian first!");
  }

  setLoading(true);

  try {
    let currentLocation = location;

if (!currentLocation) {
  try {
    currentLocation = await new Promise<[number, number]>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => reject(err),
        {
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 10000
        }
      );
    });
  } catch (err) {
    console.log("⚠ Location failed:", err);
    currentLocation = null; // ⭐ IMPORTANT
  }
}

    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

     const mapsLink = currentLocation
  ? `https://www.google.com/maps?q=${currentLocation[0]},${currentLocation[1]}`
  : "Location unavailable";

    // ✅ 1. SEND SMS FIRST
await axios.post("http://localhost:5000/send-sos", {
  guardianNumber: formatNumber(guardian.number),
  guardianName: guardian.name,
  email: user.email,
  mapsLink,
});

// ✅ 2. THEN SAVE TO FIREBASE
push(ref(db, `alerts/${user.uid}`), {
  type: "SOS",
  email: user.email || "no-email",
  guardianName: guardian.name,
  guardianNumber: guardian.number,
  mapsLink,
  timestamp: new Date().toISOString(),
});

    alert("🚨 SOS Sent!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to send SOS");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
    style={{
  width: "65px",
  height: "65px",
  borderRadius: "50%",
  background: isDisabled ? "#aaa" : "#7A3A5C",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  cursor: isDisabled ? "not-allowed" : "pointer",
  opacity: loading ? 0.6 : 1,

  // 🔥 animation
  animation: !isDisabled ? "sosPulse 1.5s infinite" : "none"
}}
      onClick={!isDisabled ? handleSOS : undefined}
    >
      {loading ? "..." : "SOS"}
    </div>
  );
};

export default SOSButton;