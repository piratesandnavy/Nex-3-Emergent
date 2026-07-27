const test = require("node:test");
const assert = require("node:assert/strict");

const EmailService = require("./services/EmailService");

test("sendToolkit attaches the personalized audit and Ultimate Guide PDFs", async () => {
  const sent = [];
  const transporter = {
    async sendMail(message) {
      sent.push(message);
      return { messageId: "test-message" };
    },
  };
  const service = new EmailService({
    smtp: { from: "NEX3 <hello@nex3.xyz>" },
    notificationEmail: "team@nex3.xyz",
    toolkitPath: "/tmp/ultimate-guide.pdf",
    transporter,
    auditPdfService: {
      async create() {
        return Buffer.from("%PDF personalized audit");
      },
    },
  });

  await service.sendToolkit({
    name: "Person Example",
    email: "person@example.com",
    audit: {
      items: [{ name: "Claude Pro", cost: 40 }],
      currentCost: 40,
      localizedCost: 13,
      savedAmount: 27,
      savedPct: 68,
      localizedItems: [
        { label: "Compute & hosting", value: 8 },
        { label: "NEX3 maintenance", value: 5 },
      ],
    },
  });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].attachments.length, 2);
  assert.equal(sent[0].attachments[0].filename, "NEX3-Personalized-AI-Budget-Audit.pdf");
  assert.equal(sent[0].attachments[0].contentType, "application/pdf");
  assert.equal(sent[0].attachments[1].filename, "TheUltimateGuidetoFreeAI-NEX3_WithLogo.pdf");
});
