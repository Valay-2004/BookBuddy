const axios = require("axios");

/**
 * Pings the server periodically to prevent spin-down on services like Render.
 * Only runs in production.
 */
function startKeepAlive() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Keep-alive: Disabled (not in production)");
    return;
  }

  // Get self URL from env or fallback to a relative path if supported
  // On Render, we usually need the absolute URL
  const selfUrl =
    process.env.SELF_URL || `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;

  if (!process.env.RENDER_EXTERNAL_HOSTNAME && !process.env.SELF_URL) {
    console.log(
      "Keep-alive: Disabled (missing SELF_URL or RENDER_EXTERNAL_HOSTNAME)",
    );
    return;
  }

  console.log(`Keep-alive: Started for ${selfUrl}`);

  // Ping every 10 minutes (600,000ms)
  setInterval(
    async () => {
      try {
        console.log(`Keep-alive: Pinging ${selfUrl}/api/health...`);
        await axios.get(`${selfUrl}/api/health`);
      } catch (err) {
        console.error("Keep-alive error:", err.message);
      }
    },
    10 * 60 * 1000,
  );
}

module.exports = startKeepAlive;
