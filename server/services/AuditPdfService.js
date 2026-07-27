const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const PDFDocument = require("pdfkit");

const WORDMARK = fs.readFileSync(
  path.join(__dirname, "../../public/images/nex3-inc-wordmark.png")
);

const COLORS = {
  background: "#0D0E0F",
  panel: "#151617",
  line: "#343638",
  paper: "#F2F0EA",
  muted: "#929491",
  acid: "#C7FF3F",
  ink: "#090A0A",
};

function money(value) {
  return `$${Math.round(Number(value) || 0)}`;
}

function invoiceNumber(lead) {
  const date = new Date(lead.timestamp || Date.now());
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const fingerprint = crypto
    .createHash("sha256")
    .update(`${lead.id || ""}:${lead.email}:${date.toISOString()}`)
    .digest("hex")
    .slice(0, 6)
    .toUpperCase();
  return `NEX3-${stamp}-${fingerprint}`;
}

class AuditPdfService {
  async create(audit, lead) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0,
        info: {
          Title: "NEX3 AI Bill Summary",
          Author: "NEX3 Inc.",
          Subject: "Personalized AI budget bill and localized AI comparison",
        },
      });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const cardY = 132;
      const cardHeight = 300;
      const cardWidth = 300;
      const leftX = 26;
      const rightX = pageWidth - cardWidth - 26;
      const centerX = pageWidth / 2;
      const billingDate = new Date(lead.timestamp || Date.now());
      const customer = lead.company && lead.company !== "Not provided"
        ? lead.company
        : lead.name;

      doc.rect(0, 0, pageWidth, pageHeight).fill(COLORS.background);

      this.drawWordmark(doc);
      this.drawBillSummary(doc, {
        invoice: invoiceNumber(lead),
        billingDate: billingDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        customer,
      });

      doc
        .roundedRect(leftX, cardY, cardWidth, cardHeight, 15)
        .fillAndStroke(COLORS.panel, COLORS.line);
      doc
        .roundedRect(rightX, cardY, cardWidth, cardHeight, 15)
        .fillAndStroke(COLORS.panel, COLORS.acid);

      this.drawCardHeader(doc, leftX, cardY, cardWidth, "YOUR BILL", COLORS.paper);
      this.drawCardHeader(doc, rightX, cardY, cardWidth, "LOCALIZED AI", COLORS.acid);

      const billRows = audit.items.slice(0, 10);
      const rowStart = cardY + 82;
      const rowGap = Math.min(35, 140 / Math.max(billRows.length, 1));
      const rowFontSize = billRows.length > 6 ? 9 : 12;
      billRows.forEach((item, index) => {
        this.drawRow(
          doc,
          leftX,
          rowStart + index * rowGap,
          cardWidth,
          item.name,
          money(item.cost),
          rowFontSize
        );
      });

      const localizedRows = [
        { label: "Self-hosted models", value: 0 },
        ...audit.localizedItems,
      ];
      localizedRows.forEach((item, index) => {
        this.drawRow(doc, rightX, rowStart + index * 38, cardWidth, item.label, money(item.value), 12);
      });

      this.drawTotal(doc, leftX, cardY, cardWidth, cardHeight, audit.currentCost, COLORS.paper);
      this.drawTotal(doc, rightX, cardY, cardWidth, cardHeight, audit.localizedCost, COLORS.acid);

      doc
        .font("Helvetica-Bold")
        .fontSize(42)
        .fillColor(COLORS.acid)
        .text(">", centerX - 28, cardY + 35, 56, { align: "center" });

      doc
        .roundedRect(centerX - 62, cardY + 105, 124, 145, 18)
        .fill(COLORS.acid);
      doc
        .font("Helvetica-Bold")
        .fontSize(43)
        .fillColor(COLORS.ink)
        .text(`${audit.savedPct}%`, centerX - 58, cardY + 133, 116, { align: "center" });
      doc
        .font("Courier-Bold")
        .fontSize(9)
        .text("S A V E D", centerX - 58, cardY + 188, 116, { align: "center" });
      doc
        .roundedRect(centerX - 43, cardY + 211, 86, 21, 11)
        .fillOpacity(0.09)
        .fill(COLORS.ink)
        .fillOpacity(1);
      doc
        .font("Courier-Bold")
        .fontSize(8.5)
        .fillColor(COLORS.ink)
        .text(`${money(audit.savedAmount)} / mo`, centerX - 43, cardY + 217, 86, { align: "center" });

      this.drawFooter(doc, audit, pageWidth, pageHeight);

      doc.end();
    });
  }

  drawWordmark(doc) {
    doc.image(WORDMARK, 24, 16, { width: 248 });
  }

  drawBillSummary(doc, summary) {
    const labelX = 550;
    const valueX = 653;
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(COLORS.paper)
      .text("BILL SUMMARY", labelX, 25);

    [
      ["Invoice #:", summary.invoice],
      ["Billing Date:", summary.billingDate],
      ["Customer:", summary.customer],
    ].forEach(([label, value], index) => {
      const y = 52 + index * 21;
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(COLORS.muted)
        .text(label, labelX, y, 95);
      doc
        .fillColor(COLORS.paper)
        .text(value, valueX, y, 160, { ellipsis: true });
    });
  }

  drawCardHeader(doc, x, y, width, label, color) {
    doc
      .font("Courier-Bold")
      .fontSize(10)
      .fillColor(color)
      .text(label, x + 24, y + 30, width - 48, { characterSpacing: 2.2 });
    doc
      .moveTo(x + 24, y + 65)
      .lineTo(x + width - 24, y + 65)
      .dash(3, { space: 3 })
      .strokeColor(COLORS.line)
      .stroke()
      .undash();
  }

  drawRow(doc, x, y, width, label, value, fontSize) {
    doc
      .font("Helvetica")
      .fontSize(fontSize)
      .fillColor(COLORS.paper)
      .text(label, x + 24, y, width - 100, { ellipsis: true });
    doc
      .font("Courier-Bold")
      .fontSize(Math.max(9, fontSize - 1))
      .text(value, x + width - 72, y, 48, { align: "right" });
  }

  drawTotal(doc, x, y, width, height, value, color) {
    const lineY = y + height - 78;
    doc
      .moveTo(x + 24, lineY)
      .lineTo(x + width - 24, lineY)
      .dash(3, { space: 3 })
      .strokeColor(COLORS.line)
      .stroke()
      .undash();
    doc
      .font("Courier")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text("/ MONTH", x + 24, y + height - 38, 80);
    doc
      .font("Helvetica-Bold")
      .fontSize(31)
      .fillColor(color)
      .text(money(value), x + width - 138, y + height - 53, 114, { align: "right" });
  }

  drawFooter(doc, audit, pageWidth, pageHeight) {
    const footerX = 26;
    const footerY = 450;
    const footerWidth = pageWidth - 52;
    const footerHeight = 100;
    doc
      .roundedRect(footerX, footerY, footerWidth, footerHeight, 14)
      .fillAndStroke(COLORS.panel, COLORS.line);

    doc
      .roundedRect(footerX + 26, footerY + 24, 34, 34, 17)
      .lineWidth(2)
      .strokeColor(COLORS.acid)
      .stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.acid)
      .text("OK", footerX + 31, footerY + 36, 24, { align: "center" });

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(COLORS.paper)
      .text(`You save ${money(audit.savedAmount)} every month`, footerX + 78, footerY + 21);
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(COLORS.muted)
      .text(
        "Switching to Localized AI with NEX3 gives you more control and lower costs.",
        footerX + 78,
        footerY + 44,
        390,
        { lineGap: 3 }
      );

    const dividerX = 555;
    doc
      .moveTo(dividerX, footerY + 16)
      .lineTo(dividerX, footerY + footerHeight - 16)
      .strokeColor(COLORS.line)
      .lineWidth(1)
      .stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.paper)
      .text("Need help?", dividerX + 34, footerY + 20);
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(COLORS.muted)
      .text("EMAIL  nex3info@gmail.com", dividerX + 34, footerY + 43);
    doc.text("WEB    www.nex3.xyz", dividerX + 34, footerY + 64);

    doc
      .font("Courier")
      .fontSize(7)
      .fillColor(COLORS.muted)
      .text("Thank you for choosing NEX3.", 0, pageHeight - 24, { align: "center" });
  }
}

module.exports = AuditPdfService;
