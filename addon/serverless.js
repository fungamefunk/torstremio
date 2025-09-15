const Router = require("router");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const requestIp = require("request-ip");
const userAgentParser = require("ua-parser-js");
const addonInterface = require("./addon.js");
const qs = require("querystring");
const { manifest } = require("./lib/manifest.js");
const { parseConfiguration, PreConfigurations } = require("./lib/configuration.js");
const landingTemplate = require("./lib/landingTemplate.js");
const moch = require("./moch/moch.js");

const router = new Router();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 300, // limit each IP to 300 requests per windowMs
  headers: false,
  keyGenerator: (req) => requestIp.getClientIp(req)
});

router.use(cors());

router.get("/", (_, res) => {
  res.redirect("/configure");
  res.end();
});

module.exports = router;