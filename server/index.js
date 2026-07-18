const config = require("./config");
const { createApp } = require("./app");

const missingVariables = config.getMissingSmtpVariables();
if (missingVariables.length) {
  console.error(`Missing required SMTP environment variables: ${missingVariables.join(", ")}`);
  process.exit(1);
}

createApp().listen(config.port, () => {
  console.info(`NEX3 API listening on port ${config.port}`);
});
