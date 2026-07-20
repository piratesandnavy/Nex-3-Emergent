const { createApp } = require("../server/app");

// Vercel invokes the Express application as a serverless function while
// preserving the original /api/* request path.
module.exports = createApp();
