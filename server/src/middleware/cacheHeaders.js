/**
 * Middleware to set Cache-Control headers for API responses.
 * @param {number} seconds - The max-age in seconds.
 */
const cacheFor = (seconds) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // public: can be cached by any cache (browser, proxy, CDN)
    // max-age: how long the resource is considered fresh
    // stale-while-revalidate: allows serving stale content while fetching fresh content in background
    res.set(
      "Cache-Control",
      `public, max-age=${seconds}, stale-while-revalidate=${seconds * 2}`,
    );
    next();
  };
};

module.exports = cacheFor;
