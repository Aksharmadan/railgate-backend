const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let gates = [
  { name: "Chromepet Railway Gate", area: "Chromepet", city: "Chennai", avgWaitMin: 10, status: "open" },
  { name: "Tambaram East Railway Gate", area: "Tambaram", city: "Chennai", avgWaitMin: null, status: "unknown" },
  { name: "Pallavaram Railway Gate", area: "Pallavaram", city: "Chennai", avgWaitMin: 8, status: "heavy" }
];

// Public API
app.get("/gates", (req, res) => {
  res.json(gates);
});

// Admin update API
app.post("/admin/update", (req, res) => {
  const { name, avgWaitMin, status } = req.body;

  gates = gates.map(g =>
    g.name === name
      ? { ...g, avgWaitMin, status }
      : g
  );

  res.json({ success: true, gates });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on", PORT));
