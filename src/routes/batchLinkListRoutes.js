const router = require("express").Router();
const { authorizeAdmin } = require("../middlewares/AuthorizeAdmin");

const {
  getAllBatchLinkLists,
  getOneBatchLinkList,
  uploadBatchLinkListsFromCSV,
  addOneBatchLinkList,
  updateOneBatchLinkList,
  deleteOneBatchLinkListById,
} = require("../controllers/batchLinkListController");

router.get("/all", getAllBatchLinkLists);
router.get("/find/:id", getOneBatchLinkList);
router.post("/bulk-upload", authorizeAdmin, uploadBatchLinkListsFromCSV);
router.post("/add", authorizeAdmin, addOneBatchLinkList);
router.patch("/update/:id", authorizeAdmin, updateOneBatchLinkList);
router.delete("/delete/:id", authorizeAdmin, deleteOneBatchLinkListById);

module.exports = router;
