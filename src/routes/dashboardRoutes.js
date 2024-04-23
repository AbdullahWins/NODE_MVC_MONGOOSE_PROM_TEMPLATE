const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const { getDashboardData } = require("../controllers/dashboardController");

router.get("/", authorizeAdmin, getDashboardData);

module.exports = router;
