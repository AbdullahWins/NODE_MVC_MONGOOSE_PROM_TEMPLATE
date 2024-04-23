const passport = require("passport");
const { adminDashboard } = require("../controllers/passportController");
const { verifyJwtToken } = require("../middlewares/verifyJwtToken");
const {
  handleGoogleCallback,
} = require("../services/authentications/passportAuth");
const router = require("express").Router();

// Initiate Google OAuth authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleCallback
);
// Protected route - Admin dashboard
router.get("/admin", verifyJwtToken, adminDashboard);

module.exports = router;
