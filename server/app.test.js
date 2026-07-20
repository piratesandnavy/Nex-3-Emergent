const test = require("node:test");
const assert = require("node:assert/strict");

const { createApp, normalizeEmail, isLeadMagnetRequest, normalizeChatRequest } = require("./app");
const ChatService = require("./services/ChatService");

test("normalizeEmail accepts and normalizes a valid address", () => {
  assert.equal(normalizeEmail("  Person@Example.COM "), "person@example.com");
});

test("normalizeEmail rejects malformed and non-string values", () => {
  assert.equal(normalizeEmail("not-an-email"), null);
  assert.equal(normalizeEmail(undefined), null);
});

test("lead magnet matching is case insensitive", () => {
  assert.equal(isLeadMagnetRequest("Please send the FREE AI guide"), true);
  assert.equal(isLeadMagnetRequest("General consulting enquiry"), false);
});

test("normalizeChatRequest validates and sanitizes context", () => {
  assert.equal(normalizeChatRequest({ messages: [{ role: "user", content: "" }] }), null);
  const input = normalizeChatRequest({
    messages: [{ role: "assistant", content: "Hello" }, { role: "user", content: "Tell me about workshops" }],
    submissionContext: { firstName: " Sam ", email: "SAM@example.com", company: "Project One" },
  });
  assert.equal(input.messages.length, 2);
  assert.equal(input.submissionContext.email, "sam@example.com");
  assert.equal(input.submissionContext.firstName, "Sam");
});

test("POST /api/chat validates and returns a reply", async (t) => {
  const calls = [];
  const chatService = { async reply(input) { calls.push(input); return "Nex3 can help with practical AI adoption."; } };
  const server = createApp({ chatService }).listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const invalid = await fetch(`${baseUrl}/api/chat`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: [] }),
  });
  assert.equal(invalid.status, 400);
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "Do I need coding experience?" }] }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { reply: "Nex3 can help with practical AI adoption." });
  assert.equal(calls.length, 1);
});

test("ChatService sends trusted instructions to Gemini and extracts text", async () => {
  const calls = [];
  const service = new ChatService({
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return { ok: true, async json() { return { candidates: [{ content: { parts: [{ text: "A concise answer." }] } }] }; } };
    },
  });
  const reply = await service.reply({ messages: [{ role: "user", content: "What do you offer?" }] });
  assert.equal(reply, "A concise answer.");
  assert.equal(calls[0].options.headers["x-goog-api-key"], "test-key");
  assert.equal(calls[0].options.body.includes("test-key"), false);
  assert.equal(calls[0].options.body.includes("AI/business/marketing strategy"), true);
  assert.equal(calls[0].options.body.includes("ADDITIONAL FAQ KNOWLEDGE"), true);
  assert.equal(calls[0].options.body.includes("startup MVPs, and micro-SaaS products"), true);
  assert.equal(calls[0].options.body.includes("Nex3 can discuss signing an NDA"), true);
  assert.equal(calls[0].options.body.includes("Mostafa Purmehdi, PhD, MBA"), true);
  assert.equal(calls[0].options.body.includes("nex3info@gmail.com"), true);
  assert.equal(calls[0].options.body.includes("nex3.info@gmail.com"), false);
});

test("POST /api/free-tools validates input and completes delivery", async (t) => {
  const savedLeads = [];
  const deliveries = [];
  const leadStore = {
    async hasRecentSubmission() { return false; },
    async create(lead) {
      const record = { id: "lead-1", status: "pending", ...lead };
      savedLeads.push(record);
      return record;
    },
    async setStatus(id, status) {
      savedLeads.find((lead) => lead.id === id).status = status;
    },
  };
  const emailService = {
    async sendToolkit(email) { deliveries.push(["visitor", email]); },
    async notifyNewLead(lead) { deliveries.push(["notification", lead.email]); },
  };
  const server = createApp({ leadStore, emailService }).listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const invalidResponse = await fetch(`${baseUrl}/api/free-tools`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Person", email: "invalid" }),
  });
  assert.equal(invalidResponse.status, 400);

  const successResponse = await fetch(`${baseUrl}/api/free-tools`, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Test Browser" },
    body: JSON.stringify({ name: "Person Example", email: "person@example.com", message: "Get Free Tools Guide", landingPage: "/audit" }),
  });
  assert.equal(successResponse.status, 200);
  assert.deepEqual(await successResponse.json(), { success: true });
  assert.equal(savedLeads[0].status, "sent");
  assert.deepEqual(deliveries, [
    ["visitor", savedLeads[0]],
    ["notification", "person@example.com"],
  ]);
});
