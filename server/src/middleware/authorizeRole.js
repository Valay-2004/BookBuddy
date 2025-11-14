// Re-export authorizeRole from auth.js to keep a single implementation
const auth = require("./auth");
module.exports = auth.authorizeRole;
