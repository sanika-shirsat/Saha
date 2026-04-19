import { useState, useEffect } from "react";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { db, auth } from "../firebase";
import { ref, onValue, push, remove, update } from "firebase/database";

function ManageGuardian() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guardians, setGuardians] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingNumber, setEditingNumber] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const guardiansRef = ref(db, `guardians/${user.uid}`);
    const unsub = onValue(guardiansRef, (snapshot) => {
      const data = snapshot.val();
      setGuardians(data ? Object.entries(data).map(([id, val]: any) => ({ id, ...val })) : []);
    });
    return () => unsub();
  }, [user]);

  const addGuardian = async () => {
    if (!user) { alert("User not logged in yet"); return; }
    if (!newName.trim() || !newNumber.trim()) { setError("Both fields are required."); return; }
    try {
      await push(ref(db, `guardians/${user.uid}`), {
        name: newName.trim(),
        number: newNumber.trim(),
      });
      setNewName(""); setNewNumber(""); setError("");
    } catch (err) {
      console.error("Firebase Error:", err);
      alert("Error adding guardian");
    }
  };

  const deleteGuardian = async (id: string) => {
    if (!window.confirm("Remove this guardian?")) return;
    await remove(ref(db, `guardians/${user.uid}/${id}`));
  };

  const startEdit = (g: any) => {
    setEditingId(g.id);
    setEditingName(g.name);
    setEditingNumber(g.number);
  };

  const saveEdit = async () => {
    if (!editingName.trim() || !editingNumber.trim()) return;
    await update(ref(db, `guardians/${user.uid}/${editingId}`), {
      name: editingName,
      number: editingNumber,
    });
    setEditingId(null);
  };

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mg-scroll::-webkit-scrollbar { display: none; }
        .mg-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .guardian-input {
          width: 100%;
          height: 50px;
          border-radius: 14px;
          background: #FAF0F5;
          border: 1.5px solid #F0D8E8;
          padding: 0 16px;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          color: #3D1A2E;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .guardian-input::placeholder { color: #C4A0B4; font-weight: 700; }
        .guardian-input:focus {
          border-color: #C97A9B;
          box-shadow: 0 0 0 3px rgba(201,122,155,0.15);
          background: #fff;
        }

        .add-btn {
          width: 100%;
          height: 50px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8B2252 0%, #C0476E 100%);
          border: none;
          font-size: 15px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          color: #fff;
          cursor: pointer;
          letter-spacing: 0.4px;
          box-shadow: 0 6px 20px rgba(139,34,82,0.28);
          transition: transform 0.15s ease;
        }
        .add-btn:active { transform: scale(0.97); }

        .guardian-card {
          background: #fff;
          border: 1.5px solid #F0D8E8;
          border-radius: 20px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
          animation: fadeUp 0.4s ease both;
          transition: box-shadow 0.18s ease;
        }
        .guardian-card:nth-child(even) { background: #FEF4F8; }
        .guardian-card:hover { box-shadow: 0 8px 24px rgba(122,58,92,0.13); }

        .edit-btn {
          background: #F2D6E8;
          color: #7A2E56;
          border: none;
          padding: 7px 14px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .edit-btn:hover { background: #EDD0E0; }

        .delete-btn {
          background: #FEF0F3;
          color: #A02040;
          border: 1.5px solid #F5C6D2;
          padding: 7px 14px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .delete-btn:hover { background: #fce4ea; }

        .save-btn {
          background: linear-gradient(135deg, #8B2252, #C0476E);
          color: #fff;
          border: none;
          padding: 8px 18px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139,34,82,0.22);
        }

        .cancel-btn {
          background: #F2D6E8;
          color: #7A2E56;
          border: none;
          padding: 8px 16px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>

      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Decorative blobs */}
        <div style={blobTR} />
        <div style={blobBL} />

        {/* Scrollable area */}
        <div className="mg-scroll" style={scrollStyle}>
          <div style={pageContainer}>

            {/* Page title */}
            <div>
              <h2 style={pageTitleStyle}>Manage Guardians</h2>
              <div style={gradientBar} />
              <p style={pageSubStyle}>Add trusted contacts who'll be alerted in emergencies.</p>
            </div>

            {/* Add form card */}
            <div style={formCard}>
              <div style={sectionRow}>
                <span style={sectionPill}>Add Guardian</span>
                <div style={sectionLine} />
              </div>

              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  placeholder="e.g. Mom, Best Friend"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="guardian-input"
                />
              </div>

              <div>
                <label style={labelStyle}>Phone / Email</label>
                <input
                  placeholder="e.g. 9876543210"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="guardian-input"
                />
              </div>

              {error && (
                <div style={errorBox}>{error}</div>
              )}

              <button className="add-btn" onClick={addGuardian}>
                + Add Guardian
              </button>
            </div>

            {/* My Guardians header */}
            <div style={{ ...sectionRow, marginTop: "4px" }}>
              <span style={sectionPill}>My Guardians</span>
              <div style={sectionLine} />
              <span style={countBadge}>{guardians.length} added</span>
            </div>

            {/* Empty state */}
            {guardians.length === 0 ? (
              <div style={emptyState}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>🧍‍♀️</div>
                <div style={emptyTitle}>No guardians added yet</div>
                <div style={emptyDesc}>Add someone you trust above</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {guardians.map((g, i) => (
                  <div
                    key={g.id}
                    className="guardian-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    {editingId === g.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="guardian-input"
                          style={{ height: "44px" }}
                        />
                        <input
                          value={editingNumber}
                          onChange={(e) => setEditingNumber(e.target.value)}
                          className="guardian-input"
                          style={{ height: "44px" }}
                        />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="save-btn" onClick={saveEdit}>Save</button>
                          <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={avatarStyle}>👤</div>
                          <div>
                            <div style={guardianName}>{g.name}</div>
                            <div style={guardianNumber}>{g.number}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                          <button className="edit-btn" onClick={() => startEdit(g)}>Edit</button>
                          <button className="delete-btn" onClick={() => deleteGuardian(g.id)}>Remove</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default ManageGuardian;

/* ── Styles ── */

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#FAF0F5",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Nunito', sans-serif",
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

const formCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #F0D8E8",
  borderRadius: "20px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  boxShadow: "0 4px 16px rgba(122,58,92,0.08)",
};

const sectionRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
};

const sectionPill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center",
  background: "#EDD0E0", color: "#7A2E56",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "10px", fontWeight: 800,
  letterSpacing: "0.6px",
  padding: "4px 12px", borderRadius: "20px",
  textTransform: "uppercase", whiteSpace: "nowrap",
};

const sectionLine: React.CSSProperties = {
  flex: 1, height: "1px", background: "#E8C8D8",
};

const countBadge: React.CSSProperties = {
  fontSize: "11px", fontWeight: 800,
  color: "#9B5B7A", flexShrink: 0,
  fontFamily: "'Nunito', sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px", fontWeight: 800,
  color: "#7A2E56",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  marginBottom: "6px",
  fontFamily: "'Nunito', sans-serif",
};

const errorBox: React.CSSProperties = {
  background: "#FEF0F3",
  border: "1.5px solid #F5C6D2",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "13px", fontWeight: 700,
  color: "#A02040",
  fontFamily: "'Nunito', sans-serif",
};

const emptyState: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #F0D8E8",
  borderRadius: "20px",
  padding: "32px 20px",
  textAlign: "center",
  boxShadow: "0 4px 16px rgba(122,58,92,0.06)",
};

const emptyTitle: React.CSSProperties = {
  fontSize: "14px", fontWeight: 800,
  color: "#9B5B7A",
  fontFamily: "'Nunito', sans-serif",
};

const emptyDesc: React.CSSProperties = {
  fontSize: "12px", fontWeight: 700,
  color: "#C4A0B4", marginTop: "4px",
  fontFamily: "'Nunito', sans-serif",
};

const avatarStyle: React.CSSProperties = {
  width: "42px", height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #F2D6E8, #EDD0E0)",
  display: "flex", alignItems: "center",
  justifyContent: "center",
  fontSize: "18px", flexShrink: 0,
};

const guardianName: React.CSSProperties = {
  fontSize: "14px", fontWeight: 800,
  color: "#3D1A2E",
  fontFamily: "'Nunito', sans-serif",
};

const guardianNumber: React.CSSProperties = {
  fontSize: "12px", fontWeight: 700,
  color: "#9B5B7A", marginTop: "2px",
  fontFamily: "'Nunito', sans-serif",
};