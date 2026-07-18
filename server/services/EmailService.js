const nodemailer = require("nodemailer");

class EmailService {
  constructor({ smtp, notificationEmail, toolkitPath, transporter }) {
    this.from = smtp.from;
    this.notificationEmail = notificationEmail;
    this.toolkitPath = toolkitPath;
    this.transporter = transporter || nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.auth,
    });
  }

  async sendToolkit(leadOrEmail) {
    const lead = typeof leadOrEmail === "string" ? { email: leadOrEmail, name: "there" } : leadOrEmail;
    const firstName = lead.name.split(/\s+/)[0];
    return this.transporter.sendMail({
      from: this.from,
      to: lead.email,
      subject: "Your Free AI Tools Guide from NEX3",
      text: [
        `Hi ${firstName},`,
        "",
        "Thank you for requesting our Ultimate Guide to Free AI.",
        "Your guide is attached to this email.",
        "",
        "Inside you'll discover:",
        "• Free ChatGPT alternatives",
        "• Open-source coding tools",
        "• Free AI image generators",
        "• Video AI",
        "• Voice AI",
        "• Installation guides",
        "• Recommended workflows",
        "",
        "If you'd like help implementing AI inside your business, simply reply to this email.",
        "— NEX3 Consulting",
        "https://nex3.xyz",
      ].join("\n"),
      attachments: [
        {
          filename: "TheUltimateGuidetoFreeAI-NEX3_WithLogo.pdf",
          path: this.toolkitPath,
          contentType: "application/pdf",
        },
      ],
    });
  }

  async notifyNewLead(lead) {
    return this.transporter.sendMail({
      from: this.from,
      to: this.notificationEmail,
      subject: "New Free AI Guide Download",
      text: [
        "A new lead downloaded the Free AI Guide.",
        "",
        "Name:",
        lead.name,
        "Email:",
        lead.email,
        "Company:",
        lead.company,
        "Message:",
        lead.message,
        "Downloaded:",
        "The Ultimate Guide to Free AI",
        "Timestamp:",
        lead.timestamp,
        "Source:",
        "/audit",
      ].join("\n"),
    });
  }
}

module.exports = EmailService;
