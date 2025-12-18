const mongoose = require("mongoose");

const gateSchema = new mongoose.Schema({
  name: String,
  area: String,
  city: String,
  avgWaitMin: Number,
  peakHours: [String],
  status: {
    type: String,
    default: "unknown"
  },
  lastUpdated: Date
});

module.exports = mongoose.model("Gate", gateSchema);
