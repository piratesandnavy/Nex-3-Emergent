const PDFDocument = require("pdfkit");

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

class AuditPdfService {
  async create(audit, lead) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0,
        info: {
          Title: "NEX3 AI Budget Audit",
          Author: "NEX3 Inc.",
          Subject: "Personalized AI subscription cost comparison",
        },
      });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const cardY = 82;
      const cardHeight = 410;
      const cardWidth = 300;
      const leftX = 32;
      const rightX = pageWidth - cardWidth - 32;
      const centerX = pageWidth / 2;

      doc.rect(0, 0, pageWidth, pageHeight).fill(COLORS.background);

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor(COLORS.paper)
        .text("NEX3", 34, 25, { continued: true })
        .font("Courier")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text("  INC.", { baseline: "middle" });

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor(COLORS.paper)
        .text("Your personalized AI budget audit", 0, 25, { align: "center" });

      doc
        .roundedRect(leftX, cardY, cardWidth, cardHeight, 16)
        .fillAndStroke(COLORS.panel, COLORS.line);
      doc
        .roundedRect(rightX, cardY, cardWidth, cardHeight, 16)
        .fillAndStroke(COLORS.panel, COLORS.acid);

      this.drawCardHeader(doc, leftX, cardY, cardWidth, "YOUR BILL", COLORS.muted);
      this.drawCardHeader(doc, rightX, cardY, cardWidth, "LOCALIZED AI", COLORS.acid);

      const billRows = audit.items.slice(0, 10);
      const rowStart = cardY + 105;
      const rowGap = Math.min(42, 220 / Math.max(billRows.length, 1));
      billRows.forEach((item, index) => {
        this.drawRow(doc, leftX, rowStart + index * rowGap, cardWidth, item.name, money(item.cost));
      });

      const localizedRows = [
        { label: "Self-hosted models", value: 0 },
        ...audit.localizedItems,
      ];
      localizedRows.forEach((item, index) => {
        this.drawRow(doc, rightX, rowStart + index * 45, cardWidth, item.label, money(item.value));
      });

      this.drawTotal(doc, leftX, cardY, cardWidth, cardHeight, audit.currentCost, COLORS.paper);
      this.drawTotal(doc, rightX, cardY, cardWidth, cardHeight, audit.localizedCost, COLORS.acid);

      doc
        .font("Helvetica-Bold")
        .fontSize(46)
        .fillColor(COLORS.acid)
        .text(">", centerX - 30, cardY + 112, 60, { align: "center" });

      doc
        .roundedRect(centerX - 67, cardY + 185, 134, 155, 20)
        .fill(COLORS.acid);
      doc
        .font("Helvetica-Bold")
        .fontSize(47)
        .fillColor(COLORS.ink)
        .text(`${audit.savedPct}%`, centerX - 62, cardY + 218, 124, { align: "center" });
      doc
        .font("Courier-Bold")
        .fontSize(10)
        .text("S A V E D", centerX - 62, cardY + 276, 124, { align: "center" });
      doc
        .roundedRect(centerX - 44, cardY + 299, 88, 22, 11)
        .fillOpacity(0.09)
        .fill(COLORS.ink)
        .fillOpacity(1);
      doc
        .font("Courier-Bold")
        .fontSize(9)
        .fillColor(COLORS.ink)
        .text(`${money(audit.savedAmount)} / mo`, centerX - 44, cardY + 306, 88, { align: "center" });

      const firstName = lead.name.split(/\s+/)[0];
      doc
        .font("Courier")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(`PREPARED FOR ${firstName.toUpperCase()}  •  NEX3.XYZ`, 32, pageHeight - 42);
      doc
        .text(new Date().toLocaleDateString("en-CA"), pageWidth - 150, pageHeight - 42, 118, {
          align: "right",
        });

      doc.end();
    });
  }

  drawCardHeader(doc, x, y, width, label, color) {
    doc
      .font("Courier-Bold")
      .fontSize(10)
      .fillColor(color)
      .text(label, x + 28, y + 35, width - 56, { characterSpacing: 2.2 });
    doc
      .moveTo(x + 28, y + 72)
      .lineTo(x + width - 28, y + 72)
      .dash(3, { space: 3 })
      .strokeColor(COLORS.line)
      .stroke()
      .undash();
  }

  drawRow(doc, x, y, width, label, value) {
    doc
      .font("Helvetica")
      .fontSize(13)
      .fillColor(COLORS.paper)
      .text(label, x + 28, y, width - 105, { ellipsis: true });
    doc
      .font("Courier-Bold")
      .fontSize(12)
      .text(value, x + width - 78, y, 50, { align: "right" });
  }

  drawTotal(doc, x, y, width, height, value, color) {
    const lineY = y + height - 100;
    doc
      .moveTo(x + 28, lineY)
      .lineTo(x + width - 28, lineY)
      .dash(3, { space: 3 })
      .strokeColor(COLORS.line)
      .stroke()
      .undash();
    doc
      .font("Courier")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text("/ MONTH", x + 28, y + height - 48, 90);
    doc
      .font("Helvetica-Bold")
      .fontSize(38)
      .fillColor(color)
      .text(money(value), x + width - 150, y + height - 67, 122, { align: "right" });
  }
}

module.exports = AuditPdfService;
