const NodeCache = require("node-cache");

// Default TTL of 60 seconds, check period 120 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

/**
 * Get a value from the cache
 */
const get = (key) => cache.get(key);

/**
 * Set a value in the cache
 * @param {string} key
 * @param {any} value
 * @param {number} ttl optional time to live in seconds
 */
const set = (key, value, ttl) => cache.set(key, value, ttl);

/**
 * Delete cache keys matching a pattern
 * Simple pattern match: prefix*
 * @param {string} pattern
 */
const invalidate = (pattern) => {
  if (!pattern) return;
  const keys = cache.keys();
  if (pattern.endsWith("*")) {
    const prefix = pattern.slice(0, -1);
    const keysToDelete = keys.filter((k) => k.startsWith(prefix));
    if (keysToDelete.length > 0) {
      cache.del(keysToDelete);
    }
  } else {
    cache.del(pattern);
  }
};

module.exports = { get, set, invalidate };
