// Route handler for admin dashboard
const adminDashboard = (req, res) => {
  console.log("Authenticated user:", req.user);
  res.send("Welcome to the admin dashboard");
};

module.exports = {
  adminDashboard,
};
