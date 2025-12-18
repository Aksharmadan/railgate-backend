const express = require("express");
const app = express();

app.use(express.json());

const gates = [
  { name: "Chromepet Railway Gate", area: "Chromepet", wait: 10, status: "unknown" },
  { name: "Tambaram East Railway Gate", area: "Tambaram", wait: 0, status: "likely open" },
  { name: "Pallavaram Railway Gate", area: "Pallavaram", wait: 8, status: "unknown" }
];

function renderUI() {
  return `
  <html>
    <head>
      <title>RailGate</title>
      <style>
        body { font-family: Arial; background:#f5f5f5; padding:20px; }
        .card { background:#fff; padding:15px; margin-bottom:15px; border-radius:10px; }
      </style>
    </head>
    <body>
      <h1>🚦 RailGate – Chennai</h1>
      ${gates.map(g => `
        <div class="card">
          <h3>${g.name}</h3>
          <p>Area: ${g.area}</p>
          <p>Status: ${g.status}</p>
          <p>Wait: ${g.wait} min</p>
        </div>
      `).join("")}
    </body>
  </html>`;
}

app.get("/", (req, res) => res.send(renderUI()));
app.get("/ui", (req, res) => res.send(renderUI()));
app.get("/api/gates", (req, res) => res.json(gates));

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.redirect("/ui"));

app.listen(PORT, () => console.log("Server running"));

/* VERSION CHECK */
app.get("/__version", (req, res) => {
  res.send("RailGate version 1.0.1");
});
