require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 Twilio setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Test route
app.get("/", (req, res) => {
  res.send("SAHA Backend Running 🚀");
});

// 🚨 SOS endpoint
// 🚨 SOS + Location endpoint
app.post("/send-sos", async (req, res) => {
  const { guardianNumber, guardianName, email, mapsLink, type } = req.body;

  try {
    // ✅ 1. Create message text FIRST
    console.log("TYPE RECEIVED:", type);
    const messageText =
  type && type.toUpperCase() === "LOCATION"
    ? `📍 Location Update

User: ${email}
Guardian: ${guardianName}

📍 Location:
${mapsLink}`
    : `🚨 EMERGENCY SOS 🚨

User: ${email}
Guardian: ${guardianName}

📍 Location:
${mapsLink}

Please help immediately!`;

    // ✅ 2. Send SMS using Twilio
    const message = await client.messages.create({
      body: messageText,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: guardianNumber,
    });

    console.log("SMS sent:", message.sid);

    res.json({
      success: true,
      message: type && type.toUpperCase() === "LOCATION"
  ? "Location shared successfully 📍"
  : "SOS sent successfully 🚨",
    });

  } catch (error) {
    console.error("Twilio Error:", error);

    res.json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});