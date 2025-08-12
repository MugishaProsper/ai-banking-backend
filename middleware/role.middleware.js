export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(402).json({ message: "Login to access this resource" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message : "You do not have permission to access here man"});
    }
    next();
  };
}; 