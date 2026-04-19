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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-field {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          background: #fff;
          border: 1.5px solid #F0D8E8;
          padding: 0 16px;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          font-weight: 600;
          color: #3D1A2E;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .login-field::placeholder {
          color: #C4A0B4;
          font-weight: 600;
        }

        .login-field:focus {
          border-color: #C97A9B;
          box-shadow: 0 0 0 3px rgba(201, 122, 155, 0.15);
        }

        .login-btn {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .login-btn:active {
          transform: scale(0.97);
          box-shadow: 0 4px 14px rgba(139, 34, 82, 0.22);
        }

        .fade-1 { animation: fadeUp 0.5s ease both; animation-delay: 0.05s; }
        .fade-2 { animation: fadeUp 0.5s ease both; animation-delay: 0.15s; }
        .fade-3 { animation: fadeUp 0.5s ease both; animation-delay: 0.25s; }
        .fade-4 { animation: fadeUp 0.5s ease both; animation-delay: 0.35s; }
        .fade-5 { animation: fadeUp 0.5s ease both; animation-delay: 0.45s; }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "390px",
          height: "844px",
          background: "#FAF0F5",
          fontFamily: "'Nunito', sans-serif",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
          boxSizing: "border-box",
        }}
      >

        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "-70px", right: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "rgba(201, 122, 155, 0.13)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-50px",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "rgba(139, 34, 82, 0.07)",
          pointerEvents: "none",
        }} />

        {/* App name */}
        <div className="fade-1" style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "42px",
            color: "#3D1A2E",
            margin: "0 0 8px",
            letterSpacing: "1px",
          }}>
            Saha
          </h1>
          <div style={{
            width: "36px", height: "3px",
            background: "linear-gradient(90deg, #C97A9B, #8B2252)",
            borderRadius: "4px",
            margin: "0 auto",
          }} />
        </div>

        {/* Card */}
        <div
          className="fade-2"
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid #F0D8E8",
            padding: "28px 24px 24px",
            boxShadow: "0 8px 32px rgba(122, 58, 92, 0.10)",
            boxSizing: "border-box",
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "26px",
              color: "#3D1A2E",
              margin: "0 0 4px",
            }}>
              Welcome Back
            </h2>
            <p style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#9B5B7A",
              margin: 0,
            }}>
              Login to continue your journey
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Email */}
            <div className="fade-3">
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 800,
                color: "#7A2E56",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-field"
              />
            </div>

            {/* Password */}
            <div className="fade-4">
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 800,
                color: "#7A2E56",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-field"
              />
              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#C97A9B",
                  cursor: "pointer",
                }}>
                  Forgot password?
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#FEF0F3",
                border: "1px solid #F5C6D2",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#A02040",
              }}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <div className="fade-5">
              <button
                type="submit"
                className="login-btn"
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "50px",
                  background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
                  border: "none",
                  fontSize: "16px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  color: "#fff",
                  cursor: "pointer",
                  letterSpacing: "0.4px",
                  boxShadow: "0 6px 20px rgba(139, 34, 82, 0.28)",
                  marginTop: "4px",
                }}
              >
                Login
              </button>
            </div>

          </form>
        </div>

        {/* Sign up link */}
        <p className="fade-5" style={{
          marginTop: "20px",
          fontSize: "13px",
          fontWeight: 600,
          color: "#9B5B7A",
          textAlign: "center",
        }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ color: "#8B2252", fontWeight: 800, cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>

      </div>
    </MobileLayout>
  );
}

export default Login;