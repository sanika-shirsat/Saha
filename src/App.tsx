import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Wizard1 from "./pages/Wizard1";
import Wizard2 from "./pages/Wizard2";
import Wizard3 from "./pages/Wizard3";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FakeCall from "./pages/FakeCall";
import InCall from "./pages/InCall";   // ✅ ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/wizard1" element={<Wizard1 />} />
        <Route path="/wizard2" element={<Wizard2 />} />
        <Route path="/wizard3" element={<Wizard3 />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/fakecall" element={<FakeCall />} />
        <Route path="/incall" element={<InCall />} />   {/* ✅ ADD THIS */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
