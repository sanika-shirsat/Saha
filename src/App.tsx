console.log("APP LOADED - VERSION 1");
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Wizard1 from "./pages/Wizard1";
import Wizard2 from "./pages/Wizard2";
import Wizard3 from "./pages/Wizard3";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Home from "./pages/Home";
import FakeCall from "./pages/FakeCall";
import InCall from "./pages/InCall";
import About from "./pages/About";
import WomensLaw from "./pages/WomensLaw";
import SafetyTips from "./pages/SafetyTips";
import Settings from "./pages/Settings";
import Helplines from "./pages/Helplines";
import ManageUnsafeZones from "./pages/ManageUnsafeZones";
import ManageGuardian from "./pages/ManageGuardian";
import Dashboard from "./pages/Dashboard";
import NearbyHelp from "./pages/NearbyHelp";
import Profile from "./pages/Profile";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Initial Flow ===== */}
        <Route path="/" element={<Splash />} />
        <Route path="/wizard1" element={<Wizard1 />} />
        <Route path="/wizard2" element={<Wizard2 />} />
        <Route path="/wizard3" element={<Wizard3 />} />

        {/* ===== Auth ===== */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ===== Main App ===== */}
        <Route path="/home" element={<Home />} />
        <Route path="/helplines" element={<Helplines />} />
        <Route path="/nearby-help" element={<NearbyHelp />} />

        {/* ===== Features ===== */}
        <Route path="/fakecall" element={<FakeCall />} />
        <Route path="/incall" element={<InCall />} />
         
      <Route path="/unsafe-zones" element={<ManageUnsafeZones />} /> 
      <Route path="/manage-guardian" element={<ManageGuardian />} />

        <Route path="/about" element={<About />} />

        <Route path="/womens-law" element={<WomensLaw />} />

        <Route path="/safety-tips" element={<SafetyTips />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />


        <Route path="*" element={<Home />} />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
