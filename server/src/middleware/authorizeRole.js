module.exports = function authorizeRole(requiredRole) {
  return (req, res, next) => {
    try {
      if (!req.user || req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ success: false, error: "Forbidden: Access denied" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
