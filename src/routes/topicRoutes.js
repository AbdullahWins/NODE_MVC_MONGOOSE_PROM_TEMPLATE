const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getAllTopics,
  getOneTopic,
  uploadTopicsFromCSV,
  addOneTopic,
  updateOneTopic,
  deleteOneTopicById,
} = require("../controllers/topicController");

router.get("/all", authorizeAdmin, getAllTopics);
router.get("/find/:id", authorizeAdmin, getOneTopic);
router.post("/bulk-upload", authorizeAdmin, uploadTopicsFromCSV);
router.post("/add", authorizeAdmin, addOneTopic);
router.patch("/update/:id", authorizeAdmin, updateOneTopic);
router.delete("/delete/:id", authorizeAdmin, deleteOneTopicById);

module.exports = router;
