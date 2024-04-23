const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getAllBatchEvaluations,
  getOneBatchEvaluation,
  getBatchEvaluationsByBatchId,
  getBatchEvaluationsByCourseNameAndBatchNumber,
  getBatchEvaluationsByUploadTime,
  uploadBatchEvaluationsFromCSV,
  addOneBatchEvaluation,
  updateOneBatchEvaluation,
  deleteOneBatchEvaluationById,
} = require("../controllers/batchEvaluationController");

router.get("/all", authorizeAdmin, getAllBatchEvaluations);
router.get("/find/:id", authorizeAdmin, getOneBatchEvaluation);
router.get("/batch/:batchNumber", authorizeAdmin, getBatchEvaluationsByBatchId);
router.get(
  "/batch",
  authorizeAdmin,
  getBatchEvaluationsByCourseNameAndBatchNumber
);
router.get(
  "/created/:createdAt",
  authorizeAdmin,
  getBatchEvaluationsByUploadTime
);
router.post("/bulk-upload", authorizeAdmin, uploadBatchEvaluationsFromCSV);
router.post("/add", addOneBatchEvaluation);
router.patch("/update/:id", authorizeAdmin, updateOneBatchEvaluation);
router.delete("/delete/:id", authorizeAdmin, deleteOneBatchEvaluationById);

module.exports = router;
