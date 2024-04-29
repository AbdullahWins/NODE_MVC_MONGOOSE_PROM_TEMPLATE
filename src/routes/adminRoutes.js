const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getOneAdmin,
  getAllAdmins,
  loginAdmin,
  registerAdmin,
  updateAdminById,
  sendPasswordResetOTP,
  validatePasswordResetOTP,
  updateAdminPasswordByOTP,
  updateAdminPasswordByOldPassword,
  deleteAdminById,
} = require("../controllers/adminController");

router.get("/find/:id", authorizeAdmin, getOneAdmin);
router.get("/all", authorizeAdmin, getAllAdmins);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/send-otp", sendPasswordResetOTP);
router.post("/validate-otp", validatePasswordResetOTP);
router.patch("/reset", updateAdminPasswordByOTP);
router.patch("/update/:id", authorizeAdmin, updateAdminById);
router.patch("/resetpassword/:email", updateAdminPasswordByOldPassword);
router.delete("/delete/:id", authorizeAdmin, deleteAdminById);

module.exports = router;
