const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_TOKEN = "railgate123";

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Mongo connected"))
  .catch(console.error);

const GateSchema = new mongoose.Schema({
  name: String,
  area: String,
  city: String,
  avgWaitMin: Number,
  status: String
});
const Gate = mongoose.model("Gate", GateSchema);

function riskByTime(now) {
  const h = now.getHours();
  // Chennai peaks: 8–10am, 6–8pm
  if ((h >= 8 && h <= 10) || (h >= 18 && h <= 20)) return "HIGH";
  if ((h >= 7 && h < 8) || (h > 10 && h <= 11) || (h >= 17 && h < 18)) return "MEDIUM";
  return "LOW";
}

async function seed() {
  if (await Gate.countDocuments() === 0) {
    await Gate.insertMany([
      { name: "Chromepet Railway Gate", area: "Chromepet", city: "Chennai", avgWaitMin: 10, status: "open" },
      { name: "Tambaram East Railway Gate", area: "Tambaram", city: "Chennai", avgWaitMin: null, status: "unknown" },
      { name: "Pallavaram Railway Gate", area: "Pallavaram", city: "Chennai", avgWaitMin: 8, status: "heavy" }
    ]);
  }
}
seed();

app.get("/gates", async (req, res) => {
  const now = new Date();
  const risk = riskByTime(now);
  const gates = (await Gate.find()).map(g => ({
    ...g.toObject(),
    risk
  }));
  res.json(gates);
});

function auth(req, res, next) {
  if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.post("/admin/update", auth, async (req, res) => {
  const { name, avgWaitMin, status } = req.body;
  await Gate.updateOne({ name }, { avgWaitMin, status });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on", PORT));
