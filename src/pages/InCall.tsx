import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";

import muteIcon from "../assets/fakecall/incall/mute.png";
import keypadIcon from "../assets/fakecall/incall/keypad.png";
import speakerIcon from "../assets/fakecall/incall/speaker.png";
import addCallIcon from "../assets/fakecall/incall/addcall.png";
import facetimeIcon from "../assets/fakecall/incall/facetime.png";
import contactsIcon from "../assets/fakecall/incall/contacts.png";
import callIcon from "../assets/fakecall/incoming/call.png";

function InCall() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const circleStyle = (left: string, top: string) => ({
    position: "absolute" as const,
    left,
    top,
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "rgba(217,217,217,0.3)", // D9D9D9 with 30% opacity
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <MobileLayout>
      <div
        style={{
          position: "relative",
          width: "390px",
          height: "844px",
          background: "#111111",
          color: "#FFFFFF",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* User Name */}
        <h1
          style={{
            position: "absolute",
            left: "146px",
            top: "130px",
            fontSize: "48px",
            fontWeight: 400,
          }}
        >
          User
        </h1>

        {/* Mobile Text */}
        <p
          style={{
            position: "absolute",
            left: "155px",
            top: "200px",
            fontSize: "24px",
            color: "#AAAAAA",
          }}
        >
          mobile
        </p>

        {/* Timer */}
        <p
          style={{
            position: "absolute",
            left: "175px",
            top: "250px",
            fontSize: "13px",
            color: "#AAAAAA",
          }}
        >
          {formatTime()}
        </p>

        {/* ROW 1 */}
        <div style={circleStyle("50px", "447px")}>
          <img src={muteIcon} width={40} height={40} />
        </div>

        <div style={circleStyle("159px", "447px")}>
          <img src={keypadIcon} width={40} height={40} />
        </div>

        <div style={circleStyle("266px", "447px")}>
          <img src={speakerIcon} width={40} height={40} />
        </div>

        {/* ROW 2 */}
        <div style={circleStyle("50px", "555px")}>
          <img src={addCallIcon} width={40} height={40} />
        </div>

        <div style={circleStyle("159px", "555px")}>
          <img src={facetimeIcon} width={40} height={40} />
        </div>

        <div style={circleStyle("266px", "555px")}>
          <img src={contactsIcon} width={40} height={40} />
        </div>

        {/* END CALL BUTTON */}
        <div
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            left: "150px",
            top: "681px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#E74C3C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={callIcon}
            width={66}
            height={66}
            style={{ transform: "rotate(-315deg)" }}
          />
        </div>
      </div>
    </MobileLayout>
  );
}

export default InCall;
