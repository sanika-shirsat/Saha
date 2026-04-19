import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileLayout from "../layouts/MobileLayout";
import { auth } from "../firebase";
import { signOut, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  /* ── Load from localStorage ── */
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications") || `{"sos":true,"safeZone":true,"guardian":true}`)
  );
  const [safetyPrefs, setSafetyPrefs] = useState(
    JSON.parse(localStorage.getItem("safetyPrefs") || `{"autoLocation":true,"autoCall":false}`)
  );

  /* ── Persist to localStorage ── */
  useEffect(() => { localStorage.setItem("language", language); }, [language]);
  useEffect(() => { localStorage.setItem("notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("safetyPrefs", JSON.stringify(safetyPrefs)); }, [safetyPrefs]);

  /* ── Toggles ── */
  const toggleNotification = (key: string) =>
    setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] });

  const toggleSafety = (key: string) =>
    setSafetyPrefs({ ...safetyPrefs, [key]: !safetyPrefs[key as keyof typeof safetyPrefs] });

  /* ── Firebase actions ── */
  const handleLogout = async () => {
    try { await signOut(auth); navigate("/login"); }
    catch (e: any) { alert("Logout failed: " + e.message); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    const user = auth.currentUser;
    if (user) {
      try { await deleteUser(user); navigate("/signup"); }
      catch (e: any) { alert("Error deleting account: " + e.message); }
    }
  };

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@700;800&display=swap');

        .settings-scroll::-webkit-scrollbar { display: none; }
        .settings-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .settings-section {
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          border-radius: 20px;
          padding: 18px 16px;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
        }

        .toggle-track {
          width: 46px;
          height: 26px;
          border-radius: 20px;
          position: relative;
          cursor: pointer;
          transition: background 0.25s ease;
          flex-shrink: 0;
        }
        .toggle-thumb {
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          transition: left 0.25s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.18);
        }

        .lang-select {
          background: #FEF4F8;
          border: 1.5px solid #F0D8E8;
          border-radius: 10px;
          padding: 6px 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #3D1A2E;
          outline: none;
          cursor: pointer;
        }
        .lang-select:focus { border-color: #C0476E; }

        .btn-logout {
          width: 100%;
          padding: 13px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #8B2252, #C0476E);
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(139,34,82,0.28);
          letter-spacing: 0.3px;
        }
        .btn-delete {
          width: 100%;
          padding: 13px;
          border-radius: 14px;
          border: 1.5px solid #F5C6D2;
          background: #FEF0F3;
          color: #A02040;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Blobs */}
        <div style={blobTR} />
        <div style={blobBL} />

        {/* Scrollable area */}
        <div className="settings-scroll" style={scrollStyle}>
          <div style={pageContainer}>

            {/* Title */}
            <div>
              <h2 style={pageTitleStyle}>Settings</h2>
              <div style={gradientBar} />
              <p style={pageSubStyle}>Manage your preferences &amp; account.</p>
            </div>

            {/* App Preferences */}
            <Section icon="🌍" label="App Preferences">
              <div style={rowStyle}>
                <div>
                  <div style={rowLabel}>Language</div>
                  <div style={rowHint}>Choose your preferred language</div>
                </div>
                <select
                  className="lang-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>
            </Section>

            {/* Notifications */}
            <Section icon="🔔" label="Notifications">
              <ToggleRow
                label="SOS Alerts"
                hint="Get alerted when SOS is triggered"
                active={notifications.sos}
                onClick={() => toggleNotification("sos")}
              />
              <div style={divider} />
              <ToggleRow
                label="Safe Zone Alerts"
                hint="Notify when entering or leaving safe zones"
                active={notifications.safeZone}
                onClick={() => toggleNotification("safeZone")}
              />
              <div style={divider} />
              <ToggleRow
                label="Guardian Updates"
                hint="Receive updates from your guardians"
                active={notifications.guardian}
                onClick={() => toggleNotification("guardian")}
              />
            </Section>

            {/* Safety Preferences */}
            <Section icon="🚨" label="Safety Preferences">
              <ToggleRow
                label="Auto Send Location on SOS"
                hint="Share live location when SOS is activated"
                active={safetyPrefs.autoLocation}
                onClick={() => toggleSafety("autoLocation")}
              />
              <div style={divider} />
              <ToggleRow
                label="Auto Call Guardian"
                hint="Automatically call your primary guardian"
                active={safetyPrefs.autoCall}
                onClick={() => toggleSafety("autoCall")}
              />
            </Section>

            {/* Account Management */}
            <Section icon="⚙️" label="Account Management">
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
              <div style={{ height: "10px" }} />
              <button className="btn-delete" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </Section>

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default Settings;

/* ── Sub-components ── */

function Section({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={sectionRow}>
        <span style={sectionPill}>{icon} {label}</span>
        <div style={sectionLine} />
      </div>
      <div className="settings-section">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, hint, active, onClick }: { label: string; hint: string; active: boolean; onClick: () => void }) {
  return (
    <div style={rowStyle}>
      <div style={{ flex: 1, paddingRight: "12px" }}>
        <div style={rowLabel}>{label}</div>
        <div style={rowHint}>{hint}</div>
      </div>
      <div
        className="toggle-track"
        onClick={onClick}
        style={{ background: active ? "linear-gradient(135deg,#8B2252,#C0476E)" : "#E8D0DC" }}
      >
        <div
          className="toggle-thumb"
          style={{ left: active ? "23px" : "3px" }}
        />
      </div>
    </div>
  );
}

/* ── Styles ── */

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#FAF0F5",
  position: "relative",
  overflow: "hidden",
};

const blobTR: React.CSSProperties = {
  position: "absolute",
  top: "-60px",
  right: "-60px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(201,122,155,0.13)",
  pointerEvents: "none",
  zIndex: 0,
};

const blobBL: React.CSSProperties = {
  position: "absolute",
  bottom: "80px",
  left: "-80px",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(139,34,82,0.07)",
  pointerEvents: "none",
  zIndex: 0,
};

const scrollStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "20px 16px",
  paddingBottom: "120px",
  position: "relative",
  zIndex: 1,
};

const pageContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const pageTitleStyle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "26px",
  color: "#3D1A2E",
  lineHeight: 1.2,
  margin: "0 0 6px 0",
};

const gradientBar: React.CSSProperties = {
  width: "48px",
  height: "3px",
  borderRadius: "2px",
  background: "linear-gradient(90deg, #C97A9B, #8B2252)",
  marginBottom: "6px",
};

const pageSubStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "#9B5B7A",
  margin: 0,
};

const sectionRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const sectionPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#EDD0E0",
  color: "#7A2E56",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  padding: "4px 12px",
  borderRadius: "20px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const sectionLine: React.CSSProperties = {
  flex: 1,
  height: "1px",
  background: "#E8C8D8",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const rowLabel: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 800,
  color: "#3D1A2E",
  marginBottom: "2px",
};

const rowHint: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px",
  fontWeight: 700,
  color: "#9B5B7A",
};

const divider: React.CSSProperties = {
  height: "1px",
  background: "#F0D8E8",
  margin: "12px 0",
};