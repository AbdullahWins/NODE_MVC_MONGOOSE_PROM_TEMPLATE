const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getAllCourses,
  getOneCourse,
  uploadCoursesFromCSV,
  addOneCourse,
  updateOneCourse,
  deleteOneCourseById,
} = require("../controllers/courseController");

router.get("/all", authorizeAdmin, getAllCourses);
router.get("/find/:id", authorizeAdmin, getOneCourse);
router.post("/bulk-upload", authorizeAdmin, uploadCoursesFromCSV);
router.post("/add", authorizeAdmin, addOneCourse);
router.patch("/update/:id", authorizeAdmin, updateOneCourse);
router.delete("/delete/:id", authorizeAdmin, deleteOneCourseById);

module.exports = router;
