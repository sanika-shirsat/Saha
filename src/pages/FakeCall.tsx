import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";

import remindIcon from "../assets/fakecall/incoming/remind.png";
import messageIcon from "../assets/fakecall/incoming/message.png";
import callIcon from "../assets/fakecall/incoming/call.png";
import ringtone from "../assets/fakecall/incoming/ringtone.mp3";

function FakeCallIncoming() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(ringtone);
    audio.loop = true;
    audioRef.current = audio;

    audio.play().catch(() => {
      console.log("Autoplay blocked");
    });

    return () => {
      audio.pause();
    };
  }, []);

  const stopAudio = () => {
    audioRef.current?.pause();
  };

  return (
    <MobileLayout>
      <div
        style={{
          position: "relative",
          width: "390px",
          height: "844px",
          background: "#111111",
          fontFamily: "Poppins, sans-serif",
          color: "#FFFFFF",
        }}
      >
        {/* USER NAME */}
        <h1
          style={{
            position: "absolute",
            top: "130px",
            width: "100%",
            textAlign: "center",
            fontSize: "48px",
            fontWeight: 400,
            margin: 0,
          }}
        >
          User
        </h1>

        {/* MOBILE */}
        <p
          style={{
            position: "absolute",
            top: "202px",
            width: "100%",
            textAlign: "center",
            fontSize: "24px",
            color: "#AAAAAA",
            margin: 0,
          }}
        >
          mobile
        </p>
        
        {/* REMIND + MESSAGE */}
<div
  style={{
    position: "absolute",
    top: "480px",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",  // balanced spacing
  }}
>
  {/* Remind */}
  <div style={{ textAlign: "center" }}>
    <img src={remindIcon} width={72} height={72} />
    <p
      style={{
        fontSize: "15px",
        color: "#AAAAAA",
        marginTop: "6px",  // 🔥 reduced spacing
        marginBottom: 0,
      }}
    >
      Remind
    </p>
  </div>

  {/* Message */}
  <div style={{ textAlign: "center" }}>
    <img src={messageIcon} width={72} height={72} />
    <p
      style={{
        fontSize: "15px",
        color: "#AAAAAA",
        marginTop: "6px",  // 🔥 reduced spacing
        marginBottom: 0,
      }}
    >
      Message
    </p>
  </div>
</div>


     {/* DECLINE + ACCEPT */}
<div
  style={{
    position: "absolute",
    top: "610px",
    width: "100%",
    display: "flex",
    justifyContent: "space-around", // balanced
  }}
>
  {/* DECLINE */}
  <div style={{ textAlign: "center" }}>
    <div
      onClick={() => {
        stopAudio();
        navigate("/");
      }}
      style={{
        width: "72px",
        height: "72px",
        background: "#E74C3C",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <img
        src={callIcon}
        width={40}
        height={40}
        style={{ transform: "rotate(-315deg)" }}  // 🔥 fixed orientation
      />
    </div>
    <p
      style={{
        fontSize: "15px",
        color: "#FFFFFF",
        marginTop: "6px",  // 🔥 tighter spacing
        marginBottom: 0,
      }}
    >
      Decline
    </p>
  </div>

  {/* ACCEPT */}
  <div style={{ textAlign: "center" }}>
    <div
      onClick={() => {
        stopAudio();
        navigate("/incall");
      }}
      style={{
        width: "72px",
        height: "72px",
        background: "#2ECC71",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <img src={callIcon} width={40} height={40} />
    </div>
    <p
      style={{
        fontSize: "15px",
        color: "#FFFFFF",
        marginTop: "6px",  // 🔥 tighter
        marginBottom: 0,
      }}
    >
      Accept
    </p>
  </div>
</div>

      </div>
    </MobileLayout>
  );
}

export default FakeCallIncoming;
