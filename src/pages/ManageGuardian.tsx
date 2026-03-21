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

  // ✅ Get logged-in user
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // ✅ Fetch guardians
  useEffect(() => {
    if (!user) return;

    const guardiansRef = ref(db, `guardians/${user.uid}`);

    const unsub = onValue(guardiansRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.entries(data).map(([id, val]: any) => ({
          id,
          ...val,
        }));
        setGuardians(list);
      } else {
        setGuardians([]);
      }
    });

    return () => unsub();
  }, [user]);

  // ✅ Add guardian
  const addGuardian = async () => {
  if (!user) {
    alert("User not logged in yet");
    return;
  }

  if (!newName.trim() || !newNumber.trim()) {
    setError("Both fields required");
    return;
  }

  try {
    const guardiansRef = ref(db, `guardians/${user.uid}`);

    await push(guardiansRef, {
      name: newName.trim(),
      number: newNumber.trim(),
    });

    setNewName("");
    setNewNumber("");
    setError("");

  } catch (err) {
    console.error("Firebase Error:", err);  // ⭐ IMPORTANT
    alert("Error adding guardian");
  }
};

  // ✅ Delete
  const deleteGuardian = async (id: string) => {
    if (!window.confirm("Remove this guardian?")) return;
    await remove(ref(db, `guardians/${user.uid}/${id}`));
  };

  // ✅ Edit start
  const startEdit = (g: any) => {
    setEditingId(g.id);
    setEditingName(g.name);
    setEditingNumber(g.number);
  };

  // ✅ Save edit
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
      <div style={containerStyle}>

        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div style={contentStyle}>

          {/* TITLE */}
          <div style={titleStyle}>Manage Guardians</div>

          {/* ADD FORM */}
          <div style={cardStyle}>
            <input
              placeholder="Name (Mom, Friend...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Phone / Email"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              style={inputStyle}
            />

            <button onClick={addGuardian} style={addBtn}>
            + Add Guardian
            </button>

            {error && <span style={{ color: "red" }}>{error}</span>}
          </div>

          {/* LIST */}
<div style={titleStyle}>My Guardians</div>

{guardians.length === 0 ? (
  <div style={{ textAlign: "center", color: "#7A3A5C", opacity: 0.7 }}>
    🧍‍♀️ No guardians added yet
  </div>
) : (
  guardians.map((g) => (
    <div key={g.id} style={guardianCard}>

      {editingId === g.id ? (
        // ✅ EDIT MODE
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          
          <input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            style={inputStyle}
          />

          <input
            value={editingNumber}
            onChange={(e) => setEditingNumber(e.target.value)}
            style={inputStyle}
          />

          <div style={btnRow}>
            <button onClick={saveEdit} style={editBtn}>
              Save
            </button>

            <button onClick={() => setEditingId(null)} style={cancelBtn}>
              Cancel
            </button>
          </div>
        </div>

      ) : (
        // ✅ NORMAL VIEW
        <>
          <div>
            <div style={nameText}>{g.name}</div>
            <div style={numberText}>{g.number}</div>
          </div>

          <div style={btnRow}>
            <button onClick={() => startEdit(g)} style={editBtn}>
              Edit
            </button>

            <button onClick={() => deleteGuardian(g.id)} style={deleteBtn}>
              Remove
            </button>
          </div>
        </>
      )}

    </div>
  ))
)}

        </div>
      </div>
    </MobileLayout>
  );
}

export default ManageGuardian;

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  fontFamily: "'ABeeZee', sans-serif",   // ✅ change this
};

const contentStyle: React.CSSProperties = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#7A3A5C",
  letterSpacing: "0.3px"
};

const cardStyle: React.CSSProperties = {
  background: "rgba(244, 226, 234, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "18px",
  borderRadius: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  border: "1px solid rgba(122,58,92,0.2)"
};

const inputStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid rgba(122,58,92,0.2)",
  outline: "none",
  fontFamily: "'ABeeZee', sans-serif",
   width: "92%",
};

const addBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #7A3A5C, #9C4F77)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "12px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(122,58,92,0.3)",
  transition: "0.2s", 
  fontFamily: "'ABeeZee', sans-serif",  
};

const guardianCard: React.CSSProperties = {
  background: "#FFF5F8",
  padding: "14px",
  borderRadius: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  marginBottom: "10px", 
};

const nameText = { fontWeight: 600, color: "#7A3A5C" };
const numberText = { fontSize: "13px", color: "#555" };

const btnRow = { display: "flex", gap: "8px", marginTop: "8px" };

const editBtn = {
  background: "#E6D6E8",
  color: "#5C3A5E",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  fontFamily: "'ABeeZee', sans-serif",   // ⭐ added
};

const deleteBtn = {
  background: "#F8D7DA",
  color: "#7A3A5C",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  fontFamily: "'ABeeZee', sans-serif",   // ⭐ added
};

const cancelBtn = {
  background: "#E0E0E0",
  color: "#555",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  fontFamily: "'ABeeZee', sans-serif",   // ⭐ added
};