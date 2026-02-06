import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Wizard1 from "./pages/Wizard1";
import Wizard2 from "./pages/Wizard2";
import Wizard3 from "./pages/Wizard3";
// import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/wizard1" element={<Wizard1 />} />
        <Route path="/wizard2" element={<Wizard2 />} />
        <Route path="/wizard3" element={<Wizard3 />} />
        {/* <Route path="/login" element={<Login />} />  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
