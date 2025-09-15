import express from 'express';
import swStats from 'swagger-stats';
import serverless from './serverless.js';
import { manifest } from './lib/manifest.js';
import { initBestTrackers } from './lib/magnetHelper.js';

const express = require("express");
const app = express();
app.get("/manifest.json", (req, res) => 
  {res.json({
    id: "torrentio",
    name: "Torrentio",
    version: "1.0.0"
  });
  });
app.enable('trust proxy');
app.use(swStats.getMiddleware({
  name: manifest().name,
  version: manifest().version,
  timelineBucketDuration: 60 * 60 * 1000,
  apdexThreshold: 100,
  authentication: true,
  onAuthenticate: (req, username, password) => {
    return username === process.env.METRICS_USER
        && password === process.env.METRICS_PASSWORD
  },
}))
app.use(express.static('static', { maxAge: '1y' }));
app.use((req, res, next) => serverless(req, res, next));
module.exports = app;
