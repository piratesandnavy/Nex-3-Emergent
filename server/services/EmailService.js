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

  async sendToolkit(email) {
    return this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: "Your Free AI Toolkit from NEX3",
      text: [
        "Hi,",
        "",
        "Thanks for requesting the NEX3 Free AI Toolkit.",
        "Your guide is attached to this email.",
        "",
        "Inside you'll discover:",
        "• Free AI alternatives",
        "• Open-source AI models",
        "• Installation guides",
        "• Local AI setup",
        "• Hardware recommendations",
        "• AI cost-saving strategies",
        "",
        "Enjoy!",
        "The NEX3 Team",
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
      subject: "New Free Toolkit Download",
      text: [
        "A new visitor downloaded the Free AI Toolkit.",
        "",
        "Email:",
        lead.email,
        "",
        "Time:",
        lead.timestamp,
        "",
        "IP:",
        lead.ip || "Unavailable",
        "",
        "Browser:",
        lead.userAgent || "Unavailable",
        "",
        "Referral:",
        lead.referrer || "Direct / unavailable",
        "",
        "Landing Page:",
        lead.landingPage || "/audit",
      ].join("\n"),
    });
  }
}

module.exports = EmailService;
