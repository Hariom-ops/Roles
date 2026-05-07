// ✅ Allow only specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Access denied. Role (${req.user.role}) not allowed`,
      });
    }

    next();
  };
};

// ✅ Admin only shortcut
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};

// ✅ Seller only shortcut
export const isSeller = (req, res, next) => {
  if (req.user?.role !== "seller") {
    return res.status(403).json({ msg: "Seller access required" });
  }
  next();
};

// ✅ User only shortcut
export const isUser = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({ msg: "User access required" });
  }
  next();
};