import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileLayout from "../layouts/MobileLayout";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const db = getFirestore();

function Profile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null); // which field is saving

  // Profile data
  const [profileData, setProfileData] = useState({ name: "", phone: "", bio: "", city: "" });
  const [editField, setEditField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: "", phone: "", bio: "", city: "" });

  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sign out confirm
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data() as any;
          const filled = {
            name: data.name || "",
            phone: data.phone || "",
            bio: data.bio || "",
            city: data.city || "",
          };
          setProfileData(filled);
          setEditValues(filled);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const startEdit = (field: string) => {
    setEditField(field);
    setEditValues({ ...profileData });
  };

  const cancelEdit = () => setEditField(null);

  const saveField = async (field: string) => {
    const user = auth.currentUser;
    if (!user) return;
    setSaving(field);
    try {
      const value = editValues[field as keyof typeof editValues];
      await updateDoc(doc(db, "users", user.uid), { [field]: value });
      setProfileData((prev) => ({ ...prev, [field]: value }));
      setEditField(null);
    } catch (err) { console.error(err); }
    setSaving(null);
  };

  const handlePasswordChange = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;
    setPasswordMsg(null);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setPasswordMsg({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword(""); setNewPassword("");
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to update password." });
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const user = auth.currentUser;
  const initials = profileData.name
    ? profileData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const FIELDS = [
    { key: "name",  label: "Full Name",    icon: "👤", placeholder: "Your full name"     },
    { key: "phone", label: "Phone Number", icon: "📞", placeholder: "Your phone number"  },
    { key: "city",  label: "City",         icon: "🏙️", placeholder: "Your city"          },
    { key: "bio",   label: "Short Bio",    icon: "✏️", placeholder: "A little about you" },
  ];

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .profile-field-input {
          width:100%; height:48px; border-radius:14px;
          border:1.5px solid #F0D8E8; background:#FAF0F5;
          padding:0 14px; font-size:14px;
          font-family:'Nunito',sans-serif; font-weight:600; color:#3D1A2E;
          outline:none; box-sizing:border-box;
          transition:border-color .2s, box-shadow .2s;
        }
        .profile-field-input:focus {
          border-color:#C97A9B;
          box-shadow:0 0 0 3px rgba(201,122,155,.15);
        }

        .save-btn {
          padding:10px 20px; border-radius:50px; border:none;
          background:linear-gradient(135deg,#8B2252,#C0476E);
          color:#fff; font-family:'Nunito',sans-serif;
          font-size:13px; font-weight:800; cursor:pointer;
          box-shadow:0 4px 12px rgba(139,34,82,.25);
          transition:transform .15s;
        }
        .save-btn:active { transform:scale(.97); }

        .edit-btn {
          padding:7px 16px; border-radius:50px;
          border:1px solid #F0D8E8; background:#F2D6E8;
          color:#7A2E56; font-family:'Nunito',sans-serif;
          font-size:12px; font-weight:800; cursor:pointer;
          transition:background .15s;
        }
        .edit-btn:hover { background:#EDD0E0; }

        .cancel-btn {
          padding:10px 16px; border-radius:50px;
          border:1.5px solid #F0D8E8; background:#fff;
          color:#9B5B7A; font-family:'Nunito',sans-serif;
          font-size:13px; font-weight:700; cursor:pointer;
        }

        .logout-btn {
          width:100%; padding:14px; border-radius:50px;
          border:1.5px solid #F5C6D2; background:#FEF0F3;
          color:#A02040; font-family:'Nunito',sans-serif;
          font-size:14px; font-weight:800; cursor:pointer;
          transition:background .15s;
        }
        .logout-btn:hover { background:#fce4ea; }

        .pw-input {
          width:100%; height:48px; border-radius:14px;
          border:1.5px solid #F0D8E8; background:#FAF0F5;
          padding:0 14px; font-size:14px;
          font-family:'Nunito',sans-serif; font-weight:600; color:#3D1A2E;
          outline:none; box-sizing:border-box;
          transition:border-color .2s, box-shadow .2s;
        }
        .pw-input:focus { border-color:#C97A9B; box-shadow:0 0 0 3px rgba(201,122,155,.15); }

        .section-card {
          background:#fff; border:1px solid #F0D8E8;
          border-radius:20px; padding:20px;
          box-shadow:0 4px 16px rgba(122,58,92,.07);
          animation:fadeUp .4s ease both;
        }
      `}</style>

      <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:"'Nunito',sans-serif" }}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div style={{ flex:1, overflowY:"auto", background:"#FAF0F5", padding:"20px 16px 48px" }}>

          {/* PAGE TITLE */}
          <div style={{ marginBottom:"20px", animationDelay:"0s" }} className="section-card"
            // inline since not a real card, just title area
          >
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"26px", color:"#3D1A2E", margin:"0 0 6px" }}>
                  My Profile
                </h2>
                <div style={{ width:"36px", height:"3px", background:"linear-gradient(90deg,#C97A9B,#8B2252)", borderRadius:"4px" }} />
              </div>
              {/* Avatar */}
              <div style={{
                width:"58px", height:"58px", borderRadius:"50%",
                background:"linear-gradient(135deg,#8B2252,#C0476E)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"22px", fontWeight:800, color:"#fff",
                boxShadow:"0 4px 16px rgba(139,34,82,.3)",
                flexShrink:0,
              }}>
                {initials}
              </div>
            </div>

            {/* Email row */}
            <div style={{
              marginTop:"16px", background:"#FAF0F5",
              borderRadius:"12px", padding:"12px 14px",
              display:"flex", alignItems:"center", gap:"10px",
            }}>
              <span style={{ fontSize:"18px" }}>📧</span>
              <div>
                <div style={{ fontSize:"10px", fontWeight:800, color:"#7A2E56", textTransform:"uppercase", letterSpacing:"0.5px" }}>Email</div>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#3D1A2E" }}>{user?.email || "—"}</div>
              </div>
              <div style={{
                marginLeft:"auto", background:"#EBF8F1", color:"#1A7A4A",
                fontSize:"10px", fontWeight:800, padding:"3px 10px", borderRadius:"20px",
                border:"1px solid #C3E8D5",
              }}>
                ✓ Verified
              </div>
            </div>
          </div>

          {/* PROFILE FIELDS */}
          <SectionLabel label="Personal Info" />

          <div className="section-card" style={{ animationDelay:"0.08s", display:"flex", flexDirection:"column", gap:"0" }}>
            {loading ? (
              <div style={{ padding:"20px 0", textAlign:"center", color:"#9B5B7A", fontSize:"14px", fontWeight:600 }}>
                Loading profile...
              </div>
            ) : (
              FIELDS.map((f, i) => (
                <div key={f.key} style={{
                  paddingTop: i === 0 ? "0" : "14px",
                  paddingBottom:"14px",
                  borderBottom: i < FIELDS.length - 1 ? "1px solid #F8EDF3" : "none",
                }}>
                  {editField === f.key ? (
                    /* EDIT MODE */
                    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                      <label style={{ fontSize:"11px", fontWeight:800, color:"#7A2E56", textTransform:"uppercase", letterSpacing:"0.5px" }}>
                        {f.icon} {f.label}
                      </label>
                      <input
                        className="profile-field-input"
                        value={editValues[f.key as keyof typeof editValues]}
                        placeholder={f.placeholder}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      />
                      <div style={{ display:"flex", gap:"8px" }}>
                        <button className="save-btn" onClick={() => saveField(f.key)} disabled={saving === f.key}>
                          {saving === f.key ? "Saving..." : "Save"}
                        </button>
                        <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* VIEW MODE */
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"10px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
                        <div style={{
                          width:"36px", height:"36px", borderRadius:"10px",
                          background:"#F2D6E8", display:"flex", alignItems:"center",
                          justifyContent:"center", fontSize:"16px", flexShrink:0,
                        }}>
                          {f.icon}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:"10px", fontWeight:800, color:"#9B5B7A", textTransform:"uppercase", letterSpacing:"0.4px" }}>
                            {f.label}
                          </div>
                          <div style={{
                            fontSize:"14px", fontWeight:700, color:"#3D1A2E",
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                          }}>
                            {profileData[f.key as keyof typeof profileData] || (
                              <span style={{ color:"#C4A0B4", fontWeight:600 }}>Not set</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="edit-btn" onClick={() => startEdit(f.key)}>Edit</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* CHANGE PASSWORD */}
          <SectionLabel label="Security" />

          <div className="section-card" style={{ animationDelay:"0.16s" }}>
            <div
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#F2D6E8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>
                  🔒
                </div>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:800, color:"#3D1A2E" }}>Change Password</div>
                  <div style={{ fontSize:"12px", fontWeight:600, color:"#9B5B7A" }}>Update your account password</div>
                </div>
              </div>
              <span style={{ fontSize:"18px", color:"#C4A0B4", transform: showPasswordSection ? "rotate(180deg)" : "none", transition:"transform .2s" }}>
                ⌄
              </span>
            </div>

            {showPasswordSection && (
              <div style={{ marginTop:"16px", display:"flex", flexDirection:"column", gap:"10px" }}>
                <div>
                  <label style={{ display:"block", fontSize:"11px", fontWeight:800, color:"#7A2E56", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>
                    Current Password
                  </label>
                  <input
                    type="password" className="pw-input" placeholder="••••••••"
                    value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"11px", fontWeight:800, color:"#7A2E56", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>
                    New Password
                  </label>
                  <input
                    type="password" className="pw-input" placeholder="Min. 6 characters"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {passwordMsg && (
                  <div style={{
                    background: passwordMsg.type === "success" ? "#EBF8F1" : "#FEF0F3",
                    border: `1px solid ${passwordMsg.type === "success" ? "#C3E8D5" : "#F5C6D2"}`,
                    borderRadius:"10px", padding:"10px 14px",
                    fontSize:"13px", fontWeight:600,
                    color: passwordMsg.type === "success" ? "#1A7A4A" : "#A02040",
                  }}>
                    {passwordMsg.type === "success" ? "✓ " : "⚠️ "}{passwordMsg.text}
                  </div>
                )}

                <button className="save-btn" onClick={handlePasswordChange}
                  disabled={!currentPassword || newPassword.length < 6}
                  style={{ opacity: (!currentPassword || newPassword.length < 6) ? 0.5 : 1 }}>
                  Update Password
                </button>
              </div>
            )}
          </div>

          {/* QUICK LINKS */}
          <SectionLabel label="Quick Links" />

          <div className="section-card" style={{ animationDelay:"0.24s", display:"flex", flexDirection:"column", gap:"0" }}>
            {[
              { icon:"👥", label:"Manage Guardians",    sub:"Add or update your trusted contacts",  path:"/manage-guardian" },
              { icon:"📍", label:"Manage Unsafe Zones", sub:"Mark areas you want to avoid",          path:"/unsafe-zones"    },
              { icon:"⚖️", label:"Women's Law",         sub:"Know your rights",                      path:"/womens-law"      },
              { icon:"🛡️", label:"Safety Tips",         sub:"Stay aware and prepared",               path:"/safety-tips"     },
            ].map((item, i, arr) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display:"flex", alignItems:"center", gap:"12px",
                  padding: i === 0 ? "0 0 14px" : i === arr.length - 1 ? "14px 0 0" : "14px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #F8EDF3" : "none",
                  cursor:"pointer",
                }}
              >
                <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#F2D6E8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>
                  {item.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"14px", fontWeight:800, color:"#3D1A2E" }}>{item.label}</div>
                  <div style={{ fontSize:"12px", fontWeight:600, color:"#9B5B7A" }}>{item.sub}</div>
                </div>
                <span style={{ color:"#C4A0B4", fontSize:"16px", flexShrink:0 }}>›</span>
              </div>
            ))}
          </div>

          {/* SIGN OUT */}
          <SectionLabel label="Account" />

          <div className="section-card" style={{ animationDelay:"0.32s" }}>
            {!showLogoutConfirm ? (
              <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
                🚪 Sign Out
              </button>
            ) : (
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#3D1A2E", marginBottom:"6px" }}>
                  Are you sure you want to sign out?
                </div>
                <div style={{ fontSize:"12px", fontWeight:600, color:"#9B5B7A", marginBottom:"16px" }}>
                  You'll need to log in again to access Saha.
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{ flex:1, padding:"12px", borderRadius:"50px", border:"1.5px solid #F0D8E8", background:"#fff", color:"#9B5B7A", fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer", fontSize:"14px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSignOut}
                    style={{ flex:1, padding:"12px", borderRadius:"50px", border:"none", background:"linear-gradient(135deg,#A02040,#D84060)", color:"#fff", fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer", fontSize:"14px", boxShadow:"0 4px 12px rgba(160,32,64,.25)" }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ textAlign:"center", marginTop:"24px", fontSize:"11px", fontWeight:600, color:"#C4A0B4" }}>
            Saha v1.0 · Stay safe. Stay empowered. 🌸
          </div>

        </div>
      </div>
    </MobileLayout>
  );
}

// ── SUB-COMPONENT ─────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", margin:"18px 0 10px" }}>
      <span style={{
        background:"#EDD0E0", color:"#7A2E56", fontSize:"10px", fontWeight:800,
        padding:"4px 12px", borderRadius:"20px", letterSpacing:"0.6px",
        textTransform:"uppercase", whiteSpace:"nowrap",
      }}>
        {label}
      </span>
      <div style={{ flex:1, height:"1px", background:"#E8C8D8" }} />
    </div>
  );
}

export default Profile;