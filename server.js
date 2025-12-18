require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Gate = require("./models/Gate");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

function isPeak(peakHours) {
  const now = new Date();
  const t = now.getHours() * 60 + now.getMinutes();
  return peakHours.some(p => {
    const [s,e] = p.split("-");
    const [sh,sm] = s.split(":");
    const [eh,em] = e.split(":");
    return t >= (+sh*60+ +sm) && t <= (+eh*60+ +em);
  });
}

function wait(g) {
  if (g.status === "open") return 0;
  if (g.status === "heavy") return g.avgWaitMin + 5;
  if (g.status === "closed") return g.avgWaitMin;
  if (isPeak(g.peakHours)) return g.avgWaitMin;
  return null;
}

app.get("/gates", async (_, res) => {
  const gates = await Gate.find();
  res.json(gates.map(g => ({
    ...g.toObject(),
    estimatedWaitMin: wait(g),
    peakNow: isPeak(g.peakHours)
  })));
});

app.post("/gates/:id/status", async (req, res) => {
  const gate = await Gate.findById(req.params.id);
  if (!gate) return res.status(404).json({ error: "Gate not found" });

  gate.status = req.body.status;
  gate.lastUpdated = new Date();
  await gate.save();

  res.json({ gate, estimatedWaitMin: wait(gate) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
