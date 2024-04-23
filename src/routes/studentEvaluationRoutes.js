const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getAllStudentEvaluations,
  getOneStudentEvaluation,
  getStudentEvaluationsByBatchId,
  getTopStudentEvaluationsByBatchId,
  getStudentEvaluationsByUploadTime,
  uploadStudentEvaluationsFromCSV,
  addOneStudentEvaluation,
  updateOneStudentEvaluation,
  deleteOneStudentEvaluationById,
} = require("../controllers/studentEvaluationController");

router.get("/all", authorizeAdmin, getAllStudentEvaluations);
router.get("/find/:id", authorizeAdmin, getOneStudentEvaluation);
router.get("/batch/:batchId", authorizeAdmin, getStudentEvaluationsByBatchId);
router.get(
  "/batch/top/:batchId",
  authorizeAdmin,
  getTopStudentEvaluationsByBatchId
);
router.get(
  "/created/:createdAt",
  authorizeAdmin,
  getStudentEvaluationsByUploadTime
);
router.post("/bulk-upload", authorizeAdmin, uploadStudentEvaluationsFromCSV);
router.post("/add", authorizeAdmin, addOneStudentEvaluation);
router.patch("/update/:id", authorizeAdmin, updateOneStudentEvaluation);
router.delete("/delete/:id", authorizeAdmin, deleteOneStudentEvaluationById);

module.exports = router;
