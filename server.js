const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("RailGate backend running");
});

// GATES API (THIS WAS MISSING)
app.get("/gates", (req, res) => {
  res.json([
    {
      name: "Chromepet Railway Gate",
      area: "Chromepet",
      city: "Chennai",
      avgWaitMin: 10
    },
    {
      name: "Tambaram East Railway Gate",
      area: "Tambaram",
      city: "Chennai",
      avgWaitMin: null
    },
    {
      name: "Pallavaram Railway Gate",
      area: "Pallavaram",
      city: "Chennai",
      avgWaitMin: 8
    }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
