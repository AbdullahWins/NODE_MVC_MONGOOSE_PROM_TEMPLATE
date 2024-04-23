const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getAllTeachers,
  getOneTeacher,
  uploadTeachersFromCSV,
  addOneTeacher,
  updateOneTeacher,
  deleteOneTeacherById,
} = require("../controllers/teacherController");

router.get("/all", authorizeAdmin, getAllTeachers);
router.get("/find/:id", authorizeAdmin, getOneTeacher);
router.post("/bulk-upload", authorizeAdmin, uploadTeachersFromCSV);
router.post("/add", authorizeAdmin, addOneTeacher);
router.patch("/update/:id", authorizeAdmin, updateOneTeacher);
router.delete("/delete/:id", authorizeAdmin, deleteOneTeacherById);

module.exports = router;
