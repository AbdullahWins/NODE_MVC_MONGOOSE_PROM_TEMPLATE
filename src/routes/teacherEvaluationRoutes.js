const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getAllTeacherEvaluations,
  getOneTeacherEvaluation,
  getTeacherEvaluationsByBatchId,
  getTeacherEvaluationsByTeacherId,
  getTeacherEvaluationsByStudentId,
  getTeacherEvaluationsByUploadTime,
  getTeacherEvaluationsByEvaluationCode,
  uploadTeacherEvaluationsFromCSV,
  addOneTeacherEvaluation,
  updateOneTeacherEvaluation,
  deleteOneTeacherEvaluationById,
} = require("../controllers/teacherEvaluationController");

router.get("/all", authorizeAdmin, getAllTeacherEvaluations);
router.get("/find/:id", authorizeAdmin, getOneTeacherEvaluation);
router.get("/batch/:batchId", authorizeAdmin, getTeacherEvaluationsByBatchId);
router.get(
  "/teacher/:teacherId",
  authorizeAdmin,
  getTeacherEvaluationsByTeacherId
);
router.get(
  "/student/:studentId",
  authorizeAdmin,
  getTeacherEvaluationsByStudentId
);
router.get(
  "/created/:createdAt",
  authorizeAdmin,
  getTeacherEvaluationsByUploadTime
);
router.get(
  "/code/:evaluationCode",
  authorizeAdmin,
  getTeacherEvaluationsByEvaluationCode
);
router.post("/bulk-upload", authorizeAdmin, uploadTeacherEvaluationsFromCSV);
router.post("/add", authorizeAdmin, addOneTeacherEvaluation);
router.patch("/update/:id", authorizeAdmin, updateOneTeacherEvaluation);
router.delete("/delete/:id", authorizeAdmin, deleteOneTeacherEvaluationById);

module.exports = router;
