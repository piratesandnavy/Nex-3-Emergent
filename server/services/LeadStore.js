const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

class LeadStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.writeQueue = Promise.resolve();
  }

  async readAll() {
    try {
      return JSON.parse(await fs.readFile(this.filePath, "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async hasRecentSubmission(email, windowMs) {
    const cutoff = Date.now() - windowMs;
    const leads = await this.readAll();
    return leads.some(
      (lead) => lead.email === email && new Date(lead.timestamp).getTime() >= cutoff
    );
  }

  async create(lead) {
    const record = {
      id: crypto.randomUUID(),
      status: "pending",
      ...lead,
    };

    await this.enqueue(async () => {
      const leads = await this.readAll();
      leads.push(record);
      await this.writeAll(leads);
    });

    return record;
  }

  async setStatus(id, status, errorMessage) {
    await this.enqueue(async () => {
      const leads = await this.readAll();
      const lead = leads.find((item) => item.id === id);
      if (!lead) return;
      lead.status = status;
      if (errorMessage) lead.error = errorMessage;
      await this.writeAll(leads);
    });
  }

  enqueue(operation) {
    this.writeQueue = this.writeQueue.then(operation, operation);
    return this.writeQueue;
  }

  async writeAll(leads) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.tmp`;
    await fs.writeFile(temporaryPath, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
    await fs.rename(temporaryPath, this.filePath);
  }
}

module.exports = LeadStore;
