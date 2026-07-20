const path = require("node:path");

require("dotenv").config({ path: [".env.local", ".env"], quiet: true });

const requiredSmtpVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
];

function getMissingSmtpVariables() {
  return requiredSmtpVariables.filter((name) => !process.env[name]);
}

module.exports = {
  port: Number(process.env.PORT || 3001),
  clientOrigin: process.env.CLIENT_ORIGIN || "https://nex3.xyz",
  notificationEmail: process.env.NOTIFICATION_EMAIL || "nex3info@gmail.com",
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  chatTimeoutMs: Number(process.env.CHAT_TIMEOUT_MS || 15000),
  leadsFile: process.env.LEADS_FILE || (process.env.VERCEL
    ? "/tmp/nex3-leads.json"
    : path.resolve(process.cwd(), "data/leads.json")),
  toolkitPath: path.resolve(
    process.cwd(),
    "public/TheUltimateGuidetoFreeAI-NEX3_WithLogo.pdf"
  ),
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    from: process.env.SMTP_FROM,
  },
  getMissingSmtpVariables,
};
