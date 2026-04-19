import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { ref, onValue } from "firebase/database";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileLayout from "../layouts/MobileLayout";

function Dashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;
      const alertsRef = ref(db, `alerts/${user.uid}`);
      onValue(alertsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.values(data);
          list.sort((a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setAlerts(list);
        } else {
          setAlerts([]);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@700;800&display=swap');

        .dash-scroll::-webkit-scrollbar { display: none; }
        .dash-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .alert-card {
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .alert-card.sos {
          background: #FEF0F3;
          border-color: #F5C6D2;
        }
        .alert-card.location {
          background: #FEF4F8;
          border-color: #F0D8E8;
        }

        .maps-link {
          color: #8B2252;
          font-weight: 800;
          text-decoration: none;
          border-bottom: 1.5px solid #F0D8E8;
        }
        .maps-link:hover { border-color: #8B2252; }
      `}</style>

      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Decorative blobs */}
        <div style={blobTR} />
        <div style={blobBL} />

        {/* Scrollable area */}
        <div className="dash-scroll" style={scrollStyle}>
          <div style={pageContainer}>

            {/* Title */}
            <div>
              <h2 style={pageTitleStyle}>Activity Dashboard</h2>
              <div style={gradientBar} />
              <p style={pageSubStyle}>Your recent alerts and location shares.</p>
            </div>

            {/* Summary pills */}
            {alerts.length > 0 && (
              <div style={summaryRow}>
                <div style={summaryPill("#FEF0F3", "#A02040", "#F5C6D2")}>
                  🚨 {alerts.filter((a) => a.type === "SOS").length} SOS
                </div>
                <div style={summaryPill("#EBF8F1", "#1A7A4A", "#C3E8D5")}>
                  📍 {alerts.filter((a) => a.type !== "SOS").length} Location
                </div>
                <div style={summaryPill("#EDD0E0", "#7A2E56", "#E0BCCE")}>
                  🕒 {alerts.length} Total
                </div>
              </div>
            )}

            {/* Section label */}
            <div style={sectionRow}>
              <span style={sectionPill}>Recent Activity</span>
              <div style={sectionLine} />
            </div>

            {/* Empty state */}
            {alerts.length === 0 ? (
              <div style={emptyState}>
                <div style={emptyIcon}>🛡️</div>
                <div style={emptyTitle}>All Clear</div>
                <div style={emptyDesc}>No activity yet. Your alerts and location shares will appear here.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {alerts.map((a: any, i) => {
                  const isSOS = a.type === "SOS";
                  return (
                    <div key={i} className={`alert-card ${isSOS ? "sos" : "location"}`}>

                      {/* Type badge + time */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={typeBadge(isSOS)}>
                          {isSOS ? "🚨 SOS Sent" : "📍 Location Shared"}
                        </div>
                        <div style={timeStyle}>
                          {new Date(a.timestamp).toLocaleString("en-IN", {
                            day: "2-digit", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{ height: "1px", background: isSOS ? "#F5C6D2" : "#F0D8E8" }} />

                      {/* Details */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        <InfoRow icon="👤" label="Guardian" value={a.guardianName} />
                        <InfoRow icon="📧" label="Email" value={a.email || "No email"} />
                        <div style={infoRowStyle}>
                          <div style={infoLeft}>
                            <span style={infoIcon}>📍</span>
                            <span style={infoLabel}>Location</span>
                          </div>
                          <a
                            href={a.mapsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="maps-link"
                            style={{ fontSize: "13px" }}
                          >
                            View on Maps ↗
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default Dashboard;

/* ── Sub-components ── */

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={infoRowStyle}>
      <div style={infoLeft}>
        <span style={infoIcon}>{icon}</span>
        <span style={infoLabel}>{label}</span>
      </div>
      <span style={infoValue}>{value}</span>
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
  top: "-60px", right: "-60px",
  width: "220px", height: "220px",
  borderRadius: "50%",
  background: "rgba(201,122,155,0.13)",
  pointerEvents: "none", zIndex: 0,
};

const blobBL: React.CSSProperties = {
  position: "absolute",
  bottom: "80px", left: "-80px",
  width: "260px", height: "260px",
  borderRadius: "50%",
  background: "rgba(139,34,82,0.07)",
  pointerEvents: "none", zIndex: 0,
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
  gap: "18px",
};

const pageTitleStyle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "26px",
  color: "#3D1A2E",
  lineHeight: 1.2,
  margin: "0 0 6px 0",
};

const gradientBar: React.CSSProperties = {
  width: "48px", height: "3px",
  borderRadius: "2px",
  background: "linear-gradient(90deg, #C97A9B, #8B2252)",
  marginBottom: "6px",
};

const pageSubStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px", fontWeight: 700,
  color: "#9B5B7A", margin: 0,
};

const summaryRow: React.CSSProperties = {
  display: "flex", gap: "8px",
};

const summaryPill = (bg: string, color: string, border: string): React.CSSProperties => ({
  flex: 1,
  textAlign: "center",
  background: bg,
  color,
  border: `1.5px solid ${border}`,
  borderRadius: "30px",
  padding: "7px 6px",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.2px",
});

const sectionRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
};

const sectionPill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center",
  background: "#EDD0E0", color: "#7A2E56",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px", fontWeight: 800,
  letterSpacing: "0.6px",
  padding: "4px 12px", borderRadius: "20px",
  textTransform: "uppercase", whiteSpace: "nowrap",
};

const sectionLine: React.CSSProperties = {
  flex: 1, height: "1px", background: "#E8C8D8",
};

const typeBadge = (isSOS: boolean): React.CSSProperties => ({
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px", fontWeight: 800,
  color: isSOS ? "#A02040" : "#7A2E56",
  background: isSOS ? "#F5C6D2" : "#EDD0E0",
  padding: "4px 10px", borderRadius: "20px",
  display: "inline-flex", alignItems: "center", gap: "4px",
});

const timeStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px", fontWeight: 700,
  color: "#9B5B7A",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const infoLeft: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "6px",
};

const infoIcon: React.CSSProperties = {
  fontSize: "13px",
};

const infoLabel: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px", fontWeight: 800,
  color: "#9B5B7A",
};

const infoValue: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px", fontWeight: 800,
  color: "#3D1A2E",
  maxWidth: "60%",
  textAlign: "right",
  wordBreak: "break-word",
};

const emptyState: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #F0D8E8",
  borderRadius: "20px",
  padding: "36px 20px",
  textAlign: "center",
  boxShadow: "0 4px 16px rgba(122,58,92,0.08)",
};

const emptyIcon: React.CSSProperties = {
  fontSize: "40px", marginBottom: "12px",
};

const emptyTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "20px", color: "#3D1A2E",
  marginBottom: "8px",
};

const emptyDesc: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px", fontWeight: 700,
  color: "#9B5B7A", lineHeight: 1.6,
};