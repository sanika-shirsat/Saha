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

        {/* ===== Features ===== */}
        <Route path="/fakecall" element={<FakeCall />} />
        <Route path="/incall" element={<InCall />} />
          
          
        <Route path="/about" element={<About />} />

        <Route path="/womens-law" element={<WomensLaw />} />

        <Route path="/safety-tips" element={<SafetyTips />} />

        <Route path="/settings" element={<Settings />} />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
