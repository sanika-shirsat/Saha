import { useState, useRef, useEffect } from "react";

/* ── Types ── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

/* ── System prompt: makes Claude a Saha safety assistant ── */
const SYSTEM_PROMPT = `You are Saha, a compassionate women's safety assistant. 
You help women with:
- Personal safety tips and advice
- Information about women's legal rights in India
- Guidance on what to do in unsafe situations
- Emotional support and reassurance
- Information about helplines and emergency contacts

Always be warm, supportive, and concise. Keep responses short (2-4 sentences max) 
unless the user needs detailed information. Never dismiss concerns. 
If someone is in immediate danger, always tell them to call 112 (emergency) or 181 (women's helpline) first.`;

/* ═══════════════════════════════════════════════════════ */
function ChatbotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi 👋 I'm Saha, your personal safety assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickReplies: any = {

  /* 👋 Greetings */
  "hello": "Hello! I’m your Safety Assistant 🤖. How can I help you today?",
  "hi": "Hi there! Stay safe 🙂. How can I assist?",
  "hey": "Hey! I'm here for your safety 💜",
  "how are you": "I’m here to help you stay safe 💜",
  "what is your name": "I’m your Saha Safety Assistant 🌸",

  /* 🚨 Emergency / Danger */
  "i feel unsafe": "🚨 Please call 112 or 181 immediately! You can also trigger SOS.",
  "i am in danger": "🚨 Call 112 immediately! Trigger SOS and alert your guardians.",
  "someone is following me": "🚨 Stay calm. Move to a crowded place immediately and call 112. Share your location now.",
  "i feel scared": "💜 Stay calm. Try to move to a safe, crowded place and contact someone you trust.",
  "help": "🆘 Help is on the way! Share your location with a trusted contact.",
  "sos": "🆘 SOS received! Contact emergency services now!",
  "harassment": "🚨 Move to a safe place and call police or 1091 (women helpline).",
  "i need police": "🚓 Call 112 for immediate police assistance.",

  /* 📞 Helplines (India) */
  "women helpline": "📞 Women's helpline: 181",
  "police number": "🚓 Police emergency number: 112",
  "ambulance": "🚑 Ambulance: 102 or 108",
  "cyber crime": "💻 Cyber crime helpline: 1930",
  "domestic violence": "🏠 Domestic violence helpline: 181",

  /* 📍 App Features */
  "how to use sos": "🆘 Tap the SOS button to alert your guardians and share your location instantly.",
  "share location": "📍 Use the 'Share Location' feature to send your live location.",
  "add guardian": "👥 Go to Manage Guardians to add trusted contacts.",
  "unsafe zones": "📍 Unsafe zones are marked on the map to help you avoid risky areas.",
  "safe zone": "🟢 Safe zones are areas you mark as secure for your safety.",

  /* ⚖️ Laws (India) */
  "my rights": "⚖️ You have the right to safety and dignity. Harassment is punishable by law.",
  "sexual harassment law": "⚖️ Punishable under IPC Section 354.",
  "stalking law": "🚫 Stalking is a crime under IPC Section 354D.",
  "domestic violence law": "🏠 Protected under the Domestic Violence Act, 2005.",

  /* 🧠 Safety Tips */
  "how to stay safe": "Stay alert, avoid isolated places, and share your location with trusted contacts.",
  "night safety": "🌙 Avoid isolated areas, stay in well-lit places, and keep your phone charged.",
  "travel safety": "🚕 Use trusted transport and share ride details with someone.",
  "self defense": "🥋 Learn basic self-defense and stay aware of surroundings.",
  "pepper spray": "🧴 Carrying pepper spray can help in emergencies.",

  /* 💬 Emotional Support */
  "i am anxious": "💜 It's okay to feel this way. Stay in a safe place and talk to someone you trust.",
  "i am alone": "🤝 You’re not alone. Reach out to a trusted contact.",
  "i am scared to go out": "💜 Plan your route, stay in safe areas, and inform someone.",

  /* 🙏 Polite */
  "thank you": "You’re welcome! Stay safe 🙂",
  "thanks": "Anytime 💜 Stay safe!",

};

const sendMessage = async () => {
  const trimmed = input.trim();
  if (!trimmed || loading) return;

  const userMessage: Message = { role: "user", content: trimmed };
  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setInput("");
  setLoading(true);

  const lowerInput = trimmed.toLowerCase();

  /* 🔥 STEP 1: CHECK QUICK REPLIES */
  const matchedKey = Object.keys(quickReplies).find((key) =>
    lowerInput.includes(key)
  );

  if (matchedKey) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: quickReplies[matchedKey] },
    ]);
    setLoading(false);
    return;
  }

  /* 🔥 STEP 2: CALL GEMINI (AI) */
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: SYSTEM_PROMPT + "\n\nUser: " + trimmed,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("FULL RESPONSE:", data); // 🔥 DEBUG

    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from AI. Please try again.";

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: replyText },
    ]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "⚠️ Something went wrong. Check internet or API key.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  /* Send on Enter key */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  /* ── UI ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=DM+Serif+Display&display=swap');

        .saha-chat-input::placeholder { color: #9B5B7A; }
        .saha-chat-input:focus { outline: none; border-color: #C0476E !important; }

        .chat-fab { transition: transform 0.2s, box-shadow 0.2s; }
        .chat-fab:hover { transform: scale(1.08); }
        .chat-fab:active { transform: scale(0.95); }

        .send-btn:hover { opacity: 0.88; }
        .send-btn:active { transform: scale(0.95); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-bubble { animation: fadeUp 0.22s ease; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1); }
        }
        .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%;
               background: #9B5B7A; margin: 0 2px; animation: blink 1.2s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-window-enter { animation: slideUp 0.25s ease; }
      `}</style>

      {/* ── Floating Button ── */}
      <div className="chat-fab" style={chatFab} onClick={() => setOpen(!open)}>
        {open ? "✕" : "💬"}
      </div>

      {/* ── Chat Window ── */}
      {open && (
        <div className="chat-window-enter" style={chatWindow}>

          {/* Header */}
          <div style={chatHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={avatarStyle}>🌸</div>
              <div>
                <div style={headerTitle}>Saha Assistant</div>
                <div style={headerSub}>Always here for you</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={closeBtn}>✕</button>
          </div>

          {/* Messages */}
          <div style={chatBody}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className="msg-bubble"
                style={msg.role === "user" ? userBubbleWrap : botBubbleWrap}
              >
                {msg.role === "assistant" && (
                  <div style={botAvatar}>🌸</div>
                )}
                <div style={msg.role === "user" ? userBubble : botBubble}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={botBubbleWrap}>
                <div style={botAvatar}>🌸</div>
                <div style={{ ...botBubble, padding: "10px 14px" }}>
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={inputRow}>
            <input
              className="saha-chat-input"
              style={inputStyle}
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="send-btn"
              style={{ ...sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default ChatbotButton;

/* ═══════════════════ STYLES ═══════════════════ */

const chatFab: React.CSSProperties = {
  position: "absolute",
  bottom: "110px",
  right: "20px",
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "22px",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(139,34,82,0.38)",
  zIndex: 1100,
  userSelect: "none",
};

const chatWindow: React.CSSProperties = {
  position: "absolute",
  bottom: "168px",
  right: "20px",
  width: "300px",
  height: "420px",
  background: "#FAF0F5",
  borderRadius: "20px",
  border: "1.5px solid #F0D8E8",
  boxShadow: "0 12px 40px rgba(139,34,82,0.18)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: 1100,
};

const chatHeader: React.CSSProperties = {
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  padding: "12px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
};

const avatarStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
};

const headerTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "15px",
  color: "#fff",
  lineHeight: 1.2,
};

const headerSub: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "10px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.75)",
};

const closeBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.18)",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const chatBody: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "14px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  scrollbarWidth: "none",
};

const botBubbleWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  gap: "6px",
};

const userBubbleWrap: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
};

const botAvatar: React.CSSProperties = {
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  background: "#F2D6E8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  flexShrink: 0,
};

const botBubble: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #F0D8E8",
  borderRadius: "16px 16px 16px 4px",
  padding: "9px 12px",
  fontSize: "12.5px",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 700,
  color: "#3D1A2E",
  lineHeight: 1.5,
  maxWidth: "200px",
  boxShadow: "0 2px 8px rgba(122,58,92,0.07)",
};

const userBubble: React.CSSProperties = {
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  borderRadius: "16px 16px 4px 16px",
  padding: "9px 12px",
  fontSize: "12.5px",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 700,
  color: "#fff",
  lineHeight: 1.5,
  maxWidth: "200px",
  boxShadow: "0 4px 12px rgba(139,34,82,0.22)",
};

const inputRow: React.CSSProperties = {
  borderTop: "1.5px solid #F0D8E8",
  padding: "10px 10px",
  display: "flex",
  gap: "8px",
  background: "#fff",
  flexShrink: 0,
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "9px 12px",
  borderRadius: "12px",
  border: "1.5px solid #F0D8E8",
  fontSize: "12.5px",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 700,
  color: "#3D1A2E",
  background: "#FAF0F5",
  transition: "border 0.2s",
};

const sendBtn: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  border: "none",
  color: "#fff",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow: "0 4px 12px rgba(139,34,82,0.28)",
  transition: "transform 0.15s, opacity 0.15s",
};