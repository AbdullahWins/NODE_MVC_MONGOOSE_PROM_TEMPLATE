const { generateToken } = require("../../../config/authentications/jwt.config");

// Callback function for Google OAuth
function handleGoogleCallback(req, res) {
  try {
    // Extract user data from request
    const user = req.user;
    const userId = user?.id;
    const userEmail = user?.emails[0]?.value; // Access the user's email
    const fullName = user?.displayName; // Access the user's full name
    const avatarUrl =
      user?.photos && user?.photos?.length > 0 ? user?.photos[0]?.value : null; // Access the user's profile photo URL

    // Generate JWT token
    const token = generateToken(userEmail);

    // Log user details
    console.log("Token:", token);
    console.log("User ID:", userId);
    console.log("User Email:", userEmail);
    console.log("Full Name:", fullName);
    console.log("Avatar URL:", avatarUrl);

    // Redirect with token as a query parameter
    res.redirect(`/admin?token=${token}`);
  } catch (error) {
    console.error("Error handling Google callback:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { handleGoogleCallback };
