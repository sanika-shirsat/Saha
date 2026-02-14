import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import MobileLayout from "../layouts/MobileLayout";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
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
        {/* Welcome Back */}
        <h2
          style={{
            position: "absolute",
            left: "34px",
            top: "145px",
            fontSize: "24px",
            color: "#7A3A5C",
            WebkitTextStroke: "0.0001px #D8A1B2",
            margin: 2,
          }}
        >
          Welcome Back
        </h2>

        {/* Login to continue */}
        <p
          style={{
            position: "absolute",
            left: "34px",
            top: "247px",
            fontSize: "16px",
            color: "#7A3A5C",
            margin: 0,
          }}
        >
          Login to continue
        </p>

        <form onSubmit={handleLogin}>
          {/* Email Box */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              position: "absolute",
              left: "53px",
              top: "270px",
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

          {/* Password Box */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              position: "absolute",
              left: "53px",
              top: "352px",
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

          {/* Forgot Password */}
          <p
            style={{
              position: "absolute",
              left: "210px",
              top: "406px",
              fontSize: "14px",
              color: "#7A6A72",
              cursor: "pointer",
              margin: 0,
            }}
          >
            Forgot password?
          </p>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              position: "absolute",
              left: "101px",
              top: "459px",
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
            Login
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p
            style={{
              position: "absolute",
              top: "520px",
              left: "53px",
              color: "red",
              fontSize: "13px",
              width: "284px",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </MobileLayout>
  );
}

export default Login;
