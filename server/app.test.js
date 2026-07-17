const test = require("node:test");
const assert = require("node:assert/strict");

const { createApp, normalizeEmail } = require("./app");

test("normalizeEmail accepts and normalizes a valid address", () => {
  assert.equal(normalizeEmail("  Person@Example.COM "), "person@example.com");
});

test("normalizeEmail rejects malformed and non-string values", () => {
  assert.equal(normalizeEmail("not-an-email"), null);
  assert.equal(normalizeEmail(undefined), null);
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
    body: JSON.stringify({ email: "invalid" }),
  });
  assert.equal(invalidResponse.status, 400);

  const successResponse = await fetch(`${baseUrl}/api/free-tools`, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Test Browser" },
    body: JSON.stringify({ email: "person@example.com", landingPage: "/audit" }),
  });
  assert.equal(successResponse.status, 200);
  assert.deepEqual(await successResponse.json(), { success: true });
  assert.equal(savedLeads[0].status, "sent");
  assert.deepEqual(deliveries, [
    ["visitor", "person@example.com"],
    ["notification", "person@example.com"],
  ]);
});
