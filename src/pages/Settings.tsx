import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { auth } from "../firebase";
import { signOut, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  /* ================= LOAD FROM LOCAL STORAGE ================= */
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );

  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications") || `{
      "sos": true,
      "safeZone": true,
      "guardian": true
    }`)
  );

  const [safetyPrefs, setSafetyPrefs] = useState(
    JSON.parse(localStorage.getItem("safetyPrefs") || `{
      "autoLocation": true,
      "autoCall": false
    }`)
  );

  /* ================= SAVE TO LOCAL STORAGE ================= */
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("safetyPrefs", JSON.stringify(safetyPrefs));
  }, [safetyPrefs]);

  /* ================= TOGGLES ================= */
  const toggleNotification = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const toggleSafety = (key: string) => {
    setSafetyPrefs({
      ...safetyPrefs,
      [key]: !safetyPrefs[key as keyof typeof safetyPrefs],
    });
  };

  /* ================= FIREBASE LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error: any) {
      alert("Logout failed: " + error.message);
    }
  };

  /* ================= FIREBASE DELETE ACCOUNT ================= */
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    const user = auth.currentUser;

    if (user) {
      try {
        await deleteUser(user);
        navigate("/signup");
      } catch (error: any) {
        alert("Error deleting account: " + error.message);
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#E9C6FF",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div style={{ padding: "90px 24px 60px 24px" }}>
        <h2
          style={{
            fontFamily: "ABeeZee, sans-serif",
            fontSize: "28px",
            color: "#2E1A22",
            WebkitTextStroke: "0.3px #7A3A5C",
            marginBottom: "30px",
          }}
        >
          Settings
        </h2>

        {/* LANGUAGE */}
        <Section title="🌍 App Preferences">
          <div style={settingRow}>
            <span>Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={selectStyle}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
            </select>
          </div>
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="🔔 Notifications">
          <ToggleRow
            label="SOS Alerts"
            active={notifications.sos}
            onClick={() => toggleNotification("sos")}
          />
          <ToggleRow
            label="Safe Zone Alerts"
            active={notifications.safeZone}
            onClick={() => toggleNotification("safeZone")}
          />
          <ToggleRow
            label="Guardian Updates"
            active={notifications.guardian}
            onClick={() => toggleNotification("guardian")}
          />
        </Section>

        {/* SAFETY */}
        <Section title="🚨 Safety Preferences">
          <ToggleRow
            label="Auto Send Location on SOS"
            active={safetyPrefs.autoLocation}
            onClick={() => toggleSafety("autoLocation")}
          />
          <ToggleRow
            label="Auto Call Guardian"
            active={safetyPrefs.autoCall}
            onClick={() => toggleSafety("autoCall")}
          />
        </Section>

        {/* ACCOUNT */}
        <Section title="⚙ Account Management">
          <button style={logoutButton} onClick={handleLogout}>
            Logout
          </button>
          <button style={deleteButton} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </Section>
      </div>
    </div>
  );
}

export default Settings;

/* COMPONENTS */

function Section({ title, children }: any) {
  return (
    <div style={sectionCard}>
      <h3 style={sectionTitle}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, active, onClick }: any) {
  return (
    <div style={settingRow}>
      <span>{label}</span>
      <div
        onClick={onClick}
        style={{
          width: "45px",
          height: "24px",
          borderRadius: "20px",
          background: active ? "#7A3A5C" : "#ccc",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            background: "white",
            borderRadius: "50%",
            position: "absolute",
            top: "2px",
            left: active ? "22px" : "2px",
            transition: "0.3s",
          }}
        />
      </div>
    </div>
  );
}

/* STYLES */

const sectionCard = {
  background: "#D9D9D9",
  border: "2px solid #7A3A5C",
  borderRadius: "20px",
  padding: "20px",
  marginBottom: "25px",
};

const sectionTitle = {
  fontSize: "20px",
  color: "#7A3A5C",
  marginBottom: "15px",
};

const settingRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "16px",
};

const logoutButton = {
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#5A3E47",
  color: "white",
  cursor: "pointer",
};

const deleteButton = {
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#B91C1C",
  color: "white",
  cursor: "pointer",
};

const selectStyle = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "1px solid #7A3A5C",
};
