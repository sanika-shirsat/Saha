import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileLayout from "../layouts/MobileLayout";

function WomensLaw() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const laws = [
    {
      icon: "🏠",
      title: "Domestic Violence Act (2005)",
      desc: "Protection for women against physical, emotional, or sexual abuse within the home.",
    },
    {
      icon: "💍",
      title: "Dowry Prohibition Act (1961)",
      desc: "Dowry is illegal. Any demand or giving of dowry is punishable by law.",
    },
    {
      icon: "💼",
      title: "POSH Act (2013)",
      desc: "Ensures women have a safe workplace free from sexual harassment.",
    },
    {
      icon: "🛡️",
      title: "POCSO Act",
      desc: "Protects children against sexual abuse and exploitation.",
    },
    {
      icon: "⚖️",
      title: "Equal Pay & Employment Rights",
      desc: "Women are entitled to equal pay and non-discriminatory treatment at work.",
    },
    {
      icon: "📺",
      title: "Indecent Representation Act",
      desc: "Prevents portrayal of women in indecent advertisements or media.",
    },
    {
      icon: "📜",
      title: "Criminal Law Amendment",
      desc: "Stricter punishments for assault and sexual offences against women.",
    },
    {
      icon: "🚫",
      title: "Protection from Trafficking",
      desc: "Laws safeguarding women against trafficking and exploitation.",
    },
  ];

  const helplines = [
    { name: "Women Helpline", number: "181", icon: "👩" },
    { name: "Police Emergency", number: "100", icon: "🚔" },
    { name: "NCW Helpline", number: "01126942369", icon: "🏛️" },
    { name: "Childline", number: "1098", icon: "🧒" },
    { name: "Legal Aid", number: "18003451800", icon: "⚖️" },
    { name: "Rape Crisis Helpline", number: "1091", icon: "🆘" },
  ];

  const faqs = [
    {
      q: "What to do in case of domestic violence?",
      a: "Contact police immediately and file an FIR. You can also call the Women Helpline (181) for immediate support and seek legal help through District Legal Services.",
    },
    {
      q: "Can I report harassment anonymously?",
      a: "Yes, complaints can be filed anonymously through the NCW portal or via trusted NGOs. Your identity will be kept confidential.",
    },
    {
      q: "Where can I get legal support?",
      a: "You can contact NCW (01126942369) or your District Legal Services Authority for free legal aid and guidance.",
    },
  ];

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=DM+Serif+Display&display=swap');

        * { box-sizing: border-box; }

        .scroll-area::-webkit-scrollbar { display: none; }
        .scroll-area { -ms-overflow-style: none; scrollbar-width: none; }

        .law-card {
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .law-card:nth-child(even) { background: #FEF4F8; }
        .law-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(122,58,92,0.13);
        }

        .helpline-card {
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .helpline-card:active {
          transform: scale(0.98);
        }

        .faq-card {
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
          transition: box-shadow 0.18s;
        }
        .faq-card:hover { box-shadow: 0 8px 24px rgba(122,58,92,0.13); }
      `}</style>

      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Decorative blobs */}
        <div style={blobTopRight} />
        <div style={blobBottomLeft} />

        {/* ── Scrollable area ── */}
        <div className="scroll-area" style={contentStyle}>
          <div style={pageContainer}>

            {/* PAGE TITLE */}
            <div>
              <h2 style={pageTitleStyle}>Women's Law & Rights</h2>
              <div style={gradientBar} />
              <p style={pageSubtitleStyle}>
                Know your rights, stay informed and protected.
              </p>
            </div>

            {/* ── KEY LAWS ── */}
            <SectionLabel label="Key Laws" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {laws.map((law, idx) => (
                <div key={idx} className="law-card">
                  <div style={lawIconBadge}>{law.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={lawTitleStyle}>{law.title}</div>
                    <div style={lawDescStyle}>{law.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── HELPLINES ── */}
            <SectionLabel label="Important Helplines" />
            <div style={helplineBanner}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff", fontFamily: "'Nunito', sans-serif", marginBottom: "4px" }}>
                📞 Tap any number to call instantly
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                All helplines are free and confidential
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {helplines.map((line, idx) => (
                <a key={idx} href={`tel:${line.number}`} className="helpline-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={helplineIconBadge}>{line.icon}</div>
                    <span style={helplineNameStyle}>{line.name}</span>
                  </div>
                  <div style={helplineNumberStyle}>{line.number}</div>
                </a>
              ))}
            </div>

            {/* ── FAQs ── */}
            <SectionLabel label="FAQs" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-card" onClick={() => toggleFaq(idx)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div style={faqQuestionStyle}>{faq.q}</div>
                    <div style={faqChevron(faqOpen === idx)}>
                      {faqOpen === idx ? "▲" : "▼"}
                    </div>
                  </div>
                  <div style={{
                    maxHeight: faqOpen === idx ? "200px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}>
                    <div style={faqAnswerStyle}>{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CLOSING CARD */}
            <div style={closingCard}>
              <div style={closingTitle}>⚖️ Your Rights Matter</div>
              <p style={closingText}>
                Every woman deserves to feel safe, respected, and protected by law.
                If you ever feel threatened or unsure, reach out — help is always available.
              </p>
            </div>

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0 2px" }}>
      <span style={sectionPill}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "#E8C8D8" }} />
    </div>
  );
}

/* ─── STYLES ──────────────────────────────────────────────── */

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#FAF0F5",
  position: "relative",
  overflow: "hidden",
};

const blobTopRight: React.CSSProperties = {
  position: "absolute",
  top: "-60px",
  right: "-60px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(201,122,155,0.13)",
  pointerEvents: "none",
  zIndex: 0,
};

const blobBottomLeft: React.CSSProperties = {
  position: "absolute",
  bottom: "80px",
  left: "-80px",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(139,34,82,0.07)",
  pointerEvents: "none",
  zIndex: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "20px 16px",
  paddingBottom: "120px",
  position: "relative",
  zIndex: 1,
};

const pageContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const pageTitleStyle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "26px",
  color: "#3D1A2E",
  lineHeight: 1.2,
  margin: "0 0 6px 0",
};

const gradientBar: React.CSSProperties = {
  width: "48px",
  height: "3px",
  borderRadius: "2px",
  background: "linear-gradient(90deg, #C97A9B, #8B2252)",
  marginBottom: "6px",
};

const pageSubtitleStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "#9B5B7A",
  margin: 0,
};

const sectionPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#EDD0E0",
  color: "#7A2E56",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  padding: "4px 12px",
  borderRadius: "20px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const lawIconBadge: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "#F2D6E8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
};

const lawTitleStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "14px",
  fontWeight: 800,
  color: "#3D1A2E",
  marginBottom: "4px",
};

const lawDescStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px",
  fontWeight: 700,
  color: "#9B5B7A",
  lineHeight: 1.55,
};

const helplineBanner: React.CSSProperties = {
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  borderRadius: "16px",
  padding: "14px 16px",
  boxShadow: "0 6px 20px rgba(139,34,82,0.28)",
};

const helplineIconBadge: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "#F2D6E8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  flexShrink: 0,
};

const helplineNameStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "14px",
  fontWeight: 800,
  color: "#3D1A2E",
};

const helplineNumberStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "15px",
  fontWeight: 800,
  color: "#8B2252",
  letterSpacing: "0.3px",
};

const faqQuestionStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "14px",
  fontWeight: 800,
  color: "#3D1A2E",
  lineHeight: 1.4,
  flex: 1,
};

const faqChevron = (open: boolean): React.CSSProperties => ({
  fontFamily: "'Nunito', sans-serif",
  fontSize: "10px",
  color: "#9B5B7A",
  flexShrink: 0,
  marginTop: "2px",
  transition: "transform 0.2s",
});

const faqAnswerStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "#9B5B7A",
  lineHeight: 1.6,
  marginTop: "10px",
  paddingTop: "10px",
  borderTop: "1px solid #F0D8E8",
};

const closingCard: React.CSSProperties = {
  background: "linear-gradient(135deg, #C97A9B 0%, #8B2252 100%)",
  borderRadius: "20px",
  padding: "22px 20px",
  textAlign: "center",
};

const closingTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "20px",
  color: "#fff",
  marginBottom: "10px",
};

const closingText: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.92)",
  lineHeight: 1.75,
  margin: 0,
};

export default WomensLaw;