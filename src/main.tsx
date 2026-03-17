import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/animations.css";   // <-- ADD THIS
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);