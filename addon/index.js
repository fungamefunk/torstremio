const express = require("express");
const swStats = require("swagger-stats");
const serverless = require("./serverless.js");
const { manifest } = require("./lib/manifest.js");
const { initBestTrackers } = require("./lib/magnetHelper.js");

const app = express();

// Manifest endpoint
app.get("/manifest.json", (req, res) => {
  res.json({
    id: "torrentio",
    name: "Torrentio",
    version: "1.0.0"
  });
});

app.enable("trust proxy");

// Metrics middleware
app.use(
  swStats.getMiddleware({
    name: manifest().name,
    version: manifest().version,
    timelineBucketDuration: 60 * 60 * 1000,
    apdexThreshold: 100,
    authentication: true,
    onAuthenticate: (req, username, password) => {
      return (
        username === process.env.METRICS_USER &&
        password === process.env.METRICS_PASSWORD
      );
    }
  })
);

// Static files
app.use(express.static("static", { maxAge: "1y" }));

// Serverless logic
app.use((req, res, next) => serverless(req, res, next));

// ✅ Export Express app (no app.listen for Vercel)
module.exports = app;