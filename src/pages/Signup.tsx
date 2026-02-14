import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import MobileLayout from "../layouts/MobileLayout";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <MobileLayout>
      <div
        style={{
          position: "relative",
          width: "390px",
          height: "844px",
          background: "#E9C6FF",
          fontFamily: "ABeeZee, sans-serif",
        }}
      >
        {/* Title */}
        <h2
          style={{
            position: "absolute",
            left: "42px",
            top: "147px",
            fontSize: "24px",
            color: "#7A3A5C",
            WebkitTextStroke: "0.01px #D8A1B2", // thinner stroke
            margin: 0,
          }}
        >
          Create Account
        </h2>

        {/* Subtitle */}
        <p
          style={{
            position: "absolute",
            left: "42px",
            top: "185px", // fixed spacing
            fontSize: "16px",
            color: "#7A3A5C",
            margin: 0,
          }}
        >
          Sign up to get started
        </p>

        <form onSubmit={handleSignup}>
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              position: "absolute",
              left: "53px",
              top: "230px",
              width: "284px",
              height: "48px",
              borderRadius: "12px",
              background: "#D9D9D9",
              border: "1px solid #7A3A5C",
              paddingLeft: "16px",
              fontSize: "14px",
              color: "#7A6A72",
              outline: "none",
            }}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              position: "absolute",
              left: "53px",
              top: "300px",
              width: "284px",
              height: "48px",
              borderRadius: "12px",
              background: "#D9D9D9",
              border: "1px solid #7A3A5C",
              paddingLeft: "16px",
              fontSize: "14px",
              color: "#7A6A72",
              outline: "none",
            }}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              position: "absolute",
              left: "53px",
              top: "370px",
              width: "284px",
              height: "48px",
              borderRadius: "12px",
              background: "#D9D9D9",
              border: "1px solid #7A3A5C",
              paddingLeft: "16px",
              fontSize: "14px",
              color: "#7A6A72",
              outline: "none",
            }}
          />

          {/* Button */}
          <button
            type="submit"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)", // perfect center
              top: "450px",
              width: "163px",
              height: "38px",
              borderRadius: "24px",
              background: "#D8A1B2",
              border: "none",
              fontSize: "20px",
              color: "#7A3A5C",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p
          style={{
            position: "absolute",
            top: "510px",
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
            color: "#7A6A72",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "#7A3A5C",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        {error && (
          <p
            style={{
              position: "absolute",
              top: "550px",
              width: "100%",
              textAlign: "center",
              color: "red",
              fontSize: "13px",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </MobileLayout>
  );
}

export default Signup;
