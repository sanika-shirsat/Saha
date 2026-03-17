require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("SAHA Backend Running 🚀");
});

// SOS endpoint
app.post("/send-sos", (req, res) => {

  const { lat, lng } = req.body;

  console.log("SOS received from location:", lat, lng);

  res.json({
    success: true,
    message: "SOS received by server"
  });

});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});