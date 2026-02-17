import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function WomensLaw() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const laws = [
    {
      title: "Domestic Violence Act (2005)",
      desc: "Protection for women against physical, emotional, or sexual abuse."
    },
    {
      title: "Dowry Prohibition Act (1961)",
      desc: "Dowry is illegal. Any demand or giving of dowry is punishable by law."
    },
    {
      title: "POSH Act (2013)",
      desc: "Ensures women have a safe workplace free from harassment."
    },
    {
      title: "POCSO Act",
      desc: "Protects children against sexual abuse and exploitation."
    },
    {
      title: "Equal Pay & Employment Rights",
      desc: "Women are entitled to equal pay and non-discriminatory treatment."
    },
    {
      title: "Indecent Representation Act",
      desc: "Prevents portrayal of women in indecent advertisements."
    },
    {
      title: "Criminal Law Amendment",
      desc: "Stricter punishments for assault and sexual offences."
    },
    {
      title: "Protection from Trafficking",
      desc: "Laws safeguarding women against trafficking and exploitation."
    }
  ];

  const helplines = [
    { name: "Women Helpline", number: "181" },
    { name: "Police Emergency", number: "100" },
    { name: "NCW", number: "01126942369" },
    { name: "Childline", number: "1098" },
    { name: "Legal Aid", number: "18003451800" },
    { name: "Rape Crisis Helpline", number: "1091" }
  ];

  const faqs = [
    {
      q: "What to do in case of domestic violence?",
      a: "Contact police immediately and file an FIR. Seek legal help if needed."
    },
    {
      q: "Can I report harassment anonymously?",
      a: "Yes, complaints can be filed anonymously through NCW or NGOs."
    },
    {
      q: "Where can I get legal support?",
      a: "You can contact NCW or District Legal Services Authority."
    }
  ];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#E9C6FF",
        fontFamily: "Poppins, sans-serif"
      }}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Content */}
      <div style={{ padding: "75px 24px 50px 24px" }}>
        
        {/* Title */}
        <h2
          style={{
            fontFamily: "ABeeZee, sans-serif",
            fontSize: "26px",
            color: "#2E1A22",
            WebkitTextStroke: "0.3px #7A3A5C",
            marginBottom: "8px"
          }}
        >
          Women’s Law & Rights
        </h2>

        <p
          style={{
            color: "#7A3A5C",
            fontSize: "18px",
            marginBottom: "30px"
          }}
        >
          Know your rights, stay informed and protected.
        </p>

        {/* ================= Laws ================= */}
        <SectionTitle title="Key Laws" />

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {laws.map((law, idx) => (
            <div key={idx} style={lawCardStyle}>
              <strong style={{ fontSize: "19px", color: "#2E1A22" }}>
                {law.title}
              </strong>
              <p
                style={{
                  fontSize: "16px",
                  marginTop: "8px",
                  color: "#5A3E47",
                  lineHeight: "1.7"
                }}
              >
                {law.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ================= Helplines ================= */}
        <SectionTitle title="Important Helplines" />

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {helplines.map((line, idx) => (
            <a
              key={idx}
              href={`tel:${line.number}`}
              style={helplineStyle}
            >
              <span>{line.name}</span>
              <strong>{line.number}</strong>
            </a>
          ))}
        </div>

        {/* ================= FAQs ================= */}
        <SectionTitle title="FAQs" />

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={faqCardStyle}
              onClick={() => toggleFaq(idx)}
            >
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                {faq.q}
              </div>

              <div
                style={{
                  maxHeight: faqOpen === idx ? "200px" : "0px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
              >
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "16px",
                    lineHeight: "1.6",
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WomensLaw;

/* ================= Reusable Components ================= */

function SectionTitle({ title }: { title: string }) {
  return (
    <h3
      style={{
        fontSize: "22px",
        color: "#7A3A5C",
        marginTop: "35px",
        marginBottom: "18px"
      }}
    >
      {title}
    </h3>
  );
}

/* ================= Styles ================= */

const lawCardStyle = {
  background: "#D9D9D9",
  border: "2px solid #7A3A5C",
  borderRadius: "16px",
  padding: "18px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const helplineStyle = {
  background: "#F2E6EF",
  border: "2px solid #7A3A5C",
  borderRadius: "14px",
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  textDecoration: "none",
  color: "#2E1A22",
  fontSize: "18px",
  fontWeight: 500,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  transition: "all 0.2s ease",
};

const faqCardStyle = {
  background: "#EAD3DB",
  borderRadius: "14px",
  padding: "16px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};
