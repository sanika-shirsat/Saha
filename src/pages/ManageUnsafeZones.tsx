import { useState, useEffect } from "react";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import { db } from "../firebase";
import { ref, onValue, set, remove } from "firebase/database";

import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { predefinedUnsafeZones } from "../data/predefinedUnsafeZones";
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
});

function MapClickHandler({ setSelectedLocation }: any) {
  useMapEvents({
    click: (e) => {
      setSelectedLocation([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

export default function ManageUnsafeZones() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [unsafeZones, setUnsafeZones] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [zoneName, setZoneName] = useState("");
  const [radius, setRadius] = useState("");

  const [currentLocation, setCurrentLocation] = useState<any>(null);

  // GET USER LOCATION
  useEffect(() => {

    navigator.geolocation.getCurrentPosition((pos) => {

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCurrentLocation([lat, lng]);

    });

  }, []);

  // FETCH USER CREATED ZONES FROM FIREBASE
  useEffect(() => {

    const zonesRef = ref(db, "unsafeZones");

    const unsub = onValue(zonesRef, (snapshot) => {

      const data = snapshot.val();

      if (data) {

        const list = Object.entries(data).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));

        setUnsafeZones(list);

      } else {
        setUnsafeZones([]);
      }

    });

    return () => unsub();

  }, []);

  // ADD NEW ZONE
  const addZone = async () => {

    if (!selectedLocation || !zoneName || !radius) {
      alert("Fill all fields");
      return;
    }

    const zoneRef = ref(db, `unsafeZones/${zoneName}`);

    await set(zoneRef, {
      lat: selectedLocation[0],
      lng: selectedLocation[1],
      radius: Number(radius),
      name: zoneName,
    });

    setZoneName("");
    setRadius("");
    setSelectedLocation(null);

  };

  // DELETE ZONE
  const deleteZone = async (name: string) => {

    const zoneRef = ref(db, `unsafeZones/${name}`);

    await remove(zoneRef);

  };
    //EDIT ZONE
    const editZone = (zone: any) => {

    setZoneName(zone.name);
    setRadius(zone.radius);
    setSelectedLocation([zone.lat, zone.lng]);

    };

  return (

    <MobileLayout>

      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div style={pageContainer}>

        <div style={titleStyle}>Manage Unsafe Zones</div>

        {currentLocation && (

          <div style={mapWrapper}>

        <div style={mapTitle}>
        Unsafe Zones Map
        </div>

        <div style={{
        fontSize: "13px",
        color: "#7A3A5C",
        marginBottom: "8px"
        }}>
  🔵 Your Location &nbsp;&nbsp; 🔴 Unsafe Zones
</div>
   <div style={{ height: "320px", borderRadius: "12px", overflow: "hidden" }}>

             <MapContainer
                center={currentLocation}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                >

              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* 🔵 USER CURRENT LOCATION */}
              <Marker position={currentLocation} icon={markerIcon} />

              {/* CLICK HANDLER */}
              <MapClickHandler setSelectedLocation={setSelectedLocation} />

              {/* SELECTED LOCATION */}
              {selectedLocation && (
                <Marker position={selectedLocation} icon={markerIcon} />
              )}

              {/* 🔴 PREDEFINED UNSAFE ZONES */}
              {predefinedUnsafeZones.map((zone) => (

                <Circle
                  key={"pre-" + zone.name}
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  color="red"
                  fillColor="red"
                  fillOpacity={0.25}
                />

              ))}

              {/* 🔴 USER CREATED ZONES */}
              {unsafeZones.map((zone) => (

                <Circle
                  key={"user-" + zone.name}
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  color="#FF69B4"
                  fillColor="#FF69B4"
                  fillOpacity={0.35}
                />

              ))}

            </MapContainer>

          </div>
        </div>
        


        )}


        {/* ADD ZONE CONTROLS */}

        <div style={{fontSize:"16px", fontWeight:600, color:"#7A3A5C"}}>
        Add New Unsafe Zone
        </div>

        <div style={inputContainer}>

          <input
            placeholder="Zone Name"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            style={inputStyle}
            />

          <input
            placeholder="Radius (meters)"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            style={inputStyle}
          />

          <button onClick={addZone} style={addButton}>
            Add Unsafe Zone
          </button>

        </div>

        {/* ZONE LIST */}

<h3 style={{ marginTop: "25px", color:"#7A3A5C" }}>
Existing Zones
</h3>

<div style={zonesList}>

{unsafeZones.map((zone) => ( (
  <div style={{fontSize:"13px", color:"#777"}}>
    No unsafe zones added yet
  </div>
)))}

</div>

{unsafeZones.map((zone) => (

  <div key={zone.name} style={zoneCard}>

    <div>
      <div style={{fontWeight:600, color:"#7A3A5C"}}>
        {zone.name}
      </div>

      <div style={{fontSize:"13px"}}>
        Radius: {zone.radius} m
      </div>
    </div>

    <div style={{display:"flex", gap:"8px"}}>

      <button
        onClick={() => editZone(zone)}
        style={editBtn}
      >
        Edit
      </button>

      <button
        onClick={() => deleteZone(zone.name)}
        style={deleteBtn}
      >
        Delete
      </button>

    </div>

  </div>

))}
 </div>

    </MobileLayout>

  );
}

// STYLES
const pageContainer: React.CSSProperties = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  fontFamily: "'ABeeZee', sans-serif",
  overflowY: "auto",
  scrollBehavior: "smooth",
  height: "calc(100vh - 80px)",
  paddingBottom: "120px"
};

const titleStyle: React.CSSProperties = {
  color: "#7A3A5C",
  fontSize: "22px",
  fontWeight: 600,
};

const mapWrapper: React.CSSProperties = {
  background: "#F4E2EA",
  borderRadius: "20px",
  padding: "14px",
  border: "2px solid #7A3A5C",
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
};

const inputGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "15px",
};

const inputStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #D6A6B8",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "'ABeeZee', sans-serif"
};

const addButton: React.CSSProperties = {
  background: "#7A3A5C",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
};

const zoneCard: React.CSSProperties = {
  background: "#F4E2EA",
  padding: "14px",
  borderRadius: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
};

const deleteBtn: React.CSSProperties = {
  background: "#E57373",
  border: "none",
  color: "white",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const inputContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  background: "#F4E2EA",
  padding: "15px",
  borderRadius: "16px",
};

const mapTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#7A3A5C",
  marginBottom: "8px"
};

const editBtn: React.CSSProperties = {
  background: "#6C8AE4",
  border: "none",
  color: "white",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const zonesList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxHeight: "250px",
  overflowY: "auto"
};