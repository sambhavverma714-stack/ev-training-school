// Simple in-memory rate limiter. Counts requests per IP address in a time window.
// Counters reset when the server restarts.
function rateLimit({ windowMs, max, message }) {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();

    // Tidy up old entries so the map does not grow forever
    if (hits.size > 1000) {
      for (const [key, entry] of hits) {
        if (now > entry.resetAt) hits.delete(key);
      }
    }

    const key = req.ip;
    let entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count++;
    if (entry.count > max) {
      const minutes = Math.ceil((entry.resetAt - now) / 60000);
      return res.status(429).json({
        error: message || `Too many attempts. Please wait about ${minutes} minute(s) and try again.`
      });
    }

    next();
  };
}

module.exports = { rateLimit };