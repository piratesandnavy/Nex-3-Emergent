const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const validator = require("validator");

const config = require("./config");
const LeadStore = require("./services/LeadStore");
const EmailService = require("./services/EmailService");
const ChatService = require("./services/ChatService");

const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > 254 || !validator.isEmail(trimmed)) return null;
  return validator.normalizeEmail(trimmed, { gmail_remove_dots: false }) || null;
}

function cleanMetadata(value, fallback, maxLength = 1000) {
  if (typeof value !== "string") return fallback;
  return validator.stripLow(value.trim(), true).slice(0, maxLength) || fallback;
}

function cleanRequired(value, maxLength) {
  if (typeof value !== "string") return null;
  const cleaned = validator.escape(validator.stripLow(value.trim(), true)).slice(0, maxLength);
  return cleaned || null;
}

function cleanChatText(value, maxLength = 1200) {
  if (typeof value !== "string") return null;
  const cleaned = validator.stripLow(value.trim(), true).slice(0, maxLength);
  return cleaned || null;
}

function normalizeChatRequest(body) {
  if (!Array.isArray(body?.messages) || body.messages.length < 1) return null;
  const messages = body.messages.slice(-10).map((message) => ({
    role: message?.role === "assistant" ? "assistant" : "user",
    content: cleanChatText(message?.content),
  }));
  if (messages.some((message) => !message.content) || messages.at(-1).role !== "user") return null;
  const supplied = body?.submissionContext;
  const email = supplied ? normalizeEmail(supplied.email) : null;
  const submissionContext = supplied && email ? {
    firstName: cleanMetadata(supplied.firstName, "", 80),
    email,
    company: cleanMetadata(supplied.company, "", 160),
  } : null;
  return { messages, submissionContext };
}

function isLeadMagnetRequest(message) {
  return /\b(free tools|get free tools|free ai|ai tools|guide|pdf)\b/i.test(message);
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip;
  return cleanMetadata(value, "Unavailable", 100);
}

function createApp(dependencies = {}) {
  const app = express();
  const leadStore = dependencies.leadStore || new LeadStore(config.leadsFile);
  const emailService = dependencies.emailService || new EmailService({
    smtp: config.smtp,
    notificationEmail: config.notificationEmail,
    toolkitPath: config.toolkitPath,
  });
  const chatService = dependencies.chatService || (config.geminiApiKey
    ? new ChatService({ apiKey: config.geminiApiKey, model: config.geminiModel, timeoutMs: config.chatTimeoutMs })
    : null);

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: config.clientOrigin, methods: ["POST"], optionsSuccessStatus: 204 }));
  app.use(express.json({ limit: "10kb" }));

  const freeToolsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again later." },
  });
  const chatLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many chat requests. Please wait a few minutes and try again." },
  });

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.post("/api/chat", chatLimiter, async (req, res) => {
    if (!chatService) return res.status(503).json({ error: "The AI assistant is not configured." });
    const input = normalizeChatRequest(req.body);
    if (!input) return res.status(400).json({ error: "A valid message is required." });
    try {
      const reply = await chatService.reply(input);
      if (!reply) throw new Error("Empty provider response");
      return res.status(200).json({ reply });
    } catch (error) {
      console.error("Chat request failed", { name: error?.name, status: error?.status });
      return res.status(502).json({ error: "The AI assistant is temporarily unavailable. Please try again." });
    }
  });

  app.post("/api/free-tools", freeToolsLimiter, async (req, res) => {
    const name = cleanRequired(req.body?.name, 120);
    const email = normalizeEmail(req.body?.email);
    const company = cleanMetadata(req.body?.company, "Not provided", 200);
    const message = cleanMetadata(req.body?.message, "Get Free Tools Guide", 2000);
    if (!name || !email) {
      return res.status(400).json({ error: "Name and a valid email address are required." });
    }
    if (!isLeadMagnetRequest(message)) {
      return res.status(400).json({ error: "This endpoint only accepts Free AI Guide requests." });
    }

    try {
      if (await leadStore.hasRecentSubmission(email, DUPLICATE_WINDOW_MS)) {
        return res.status(409).json({
          error: "This email requested the toolkit recently. Please check your inbox.",
        });
      }

      const timestamp = new Date().toISOString();
      const lead = await leadStore.create({
        name,
        email,
        company,
        message,
        timestamp,
        ip: getClientIp(req),
        userAgent: cleanMetadata(req.get("user-agent"), "Unavailable"),
        referrer: cleanMetadata(req.body?.referrer || req.get("referer"), "Direct / unavailable"),
        landingPage: cleanMetadata(req.body?.landingPage, "/audit", 500),
      });

      try {
        await Promise.all([
          emailService.sendToolkit(lead),
          emailService.notifyNewLead(lead),
        ]);
        await leadStore.setStatus(lead.id, "sent");
        console.info("Free toolkit delivered", { leadId: lead.id, email, timestamp });
        return res.status(200).json({ success: true });
      } catch (smtpError) {
        await leadStore.setStatus(lead.id, "failed", smtpError.message);
        console.error("SMTP delivery failed", { leadId: lead.id, error: smtpError });
        return res.status(502).json({ error: "Email delivery failed. Please try again." });
      }
    } catch (error) {
      console.error("Free toolkit request failed", { email, error });
      return res.status(500).json({ error: "Unable to process the request." });
    }
  });

  app.use((error, _req, res, _next) => {
    console.error("Unhandled server error", error);
    res.status(500).json({ error: "Internal server error." });
  });

  return app;
}

module.exports = { createApp, normalizeEmail, isLeadMagnetRequest, normalizeChatRequest };
