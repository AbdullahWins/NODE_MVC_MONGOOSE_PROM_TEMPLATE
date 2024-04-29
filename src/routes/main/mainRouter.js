const router = require("express").Router();

//import routes
const defaultRoutes = require("./defaultRoutes");
const adminRoutes = require("../adminRoutes");
const studentRoutes = require("../studentRoutes");
const teacherRoutes = require("../teacherRoutes");
const courseRoutes = require("../courseRoutes");
const topicRoutes = require("../topicRoutes");
const batchRoutes = require("../batchRoutes");
const studentEvaluationRoutes = require("../studentEvaluationRoutes");
const teacherEvaluationRoutes = require("../teacherEvaluationRoutes");
const batchEvaluationRoutes = require("../batchEvaluationRoutes");
const batchLinkListRoutes = require("../batchLinkListRoutes");
const dashboardRoutes = require("../dashboardRoutes");

//routes
router.use(defaultRoutes);

//routes with prefixes
router.use("/admins", adminRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/courses", courseRoutes);
router.use("/topics", topicRoutes);
router.use("/batches", batchRoutes);
router.use("/student-evaluations", studentEvaluationRoutes);
router.use("/teacher-evaluations", teacherEvaluationRoutes);
router.use("/batch-evaluations", batchEvaluationRoutes);
router.use("/batch-link-list", batchLinkListRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
