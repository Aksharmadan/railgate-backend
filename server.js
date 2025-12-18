const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_TOKEN = "railgate123"; // change later

// 🔗 MongoDB (put your URI in Render env, not here)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Mongo connected"))
  .catch(err => console.error("Mongo error", err));

// 🧱 Schema
const GateSchema = new mongoose.Schema({
  name: String,
  area: String,
  city: String,
  avgWaitMin: Number,
  status: String
});
const Gate = mongoose.model("Gate", GateSchema);

// 🌱 Seed once if empty
async function seed() {
  const count = await Gate.countDocuments();
  if (count === 0) {
    await Gate.insertMany([
      { name: "Chromepet Railway Gate", area: "Chromepet", city: "Chennai", avgWaitMin: 10, status: "open" },
      { name: "Tambaram East Railway Gate", area: "Tambaram", city: "Chennai", avgWaitMin: null, status: "unknown" },
      { name: "Pallavaram Railway Gate", area: "Pallavaram", city: "Chennai", avgWaitMin: 8, status: "heavy" }
    ]);
    console.log("Seeded gates");
  }
}
seed();

// 🔓 Public API
app.get("/gates", async (req, res) => {
  const gates = await Gate.find();
  res.json(gates);
});

// 🔐 Auth
function auth(req, res, next) {
  if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ✏️ Admin update
app.post("/admin/update", auth, async (req, res) => {
  const { name, avgWaitMin, status } = req.body;
  await Gate.updateOne({ name }, { avgWaitMin, status });
  const gates = await Gate.find();
  res.json({ success: true, gates });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on", PORT));
