// Controllers/BatchLinkListController.js

const BatchLinkList = require("../models/BatchLinkListModel");
const { logger } = require("../services/loggers/Winston");
const { ValidObjectId } = require("../services/validators/ValidObjectId");

//get all BatchLinkList using mongoose
const getAllBatchLinkLists = async (req, res) => {
  try {
    //perform query on database
    const batchLinkLists = await BatchLinkList.getAllBatchLinkLists();
    if (batchLinkLists?.length === 0) {
      return res.status(200).send([]);
    }
    logger.log("info", `Found ${batchLinkLists?.length} batchLinkLists`);
    return res.status(200).send(batchLinkLists);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server Error" });
  }
};

//get single batchLinkList using mongoose
const getOneBatchLinkList = async (req, res) => {
  try {
    const batchLinkListId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(batchLinkListId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //perform query on database
    const batchLinkList = await BatchLinkList.getBatchLinkListById(
      batchLinkListId
    );
    if (!batchLinkList) {
      return res.status(404).send({ message: "batchLinkList not found" });
    } else {
      logger.log("info", JSON.stringify(batchLinkList, null, 2));
      return res.status(200).send(batchLinkList);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

const uploadBatchLinkListsFromCSV = async (req, res) => {
  try {
    // Check if file is provided in request
    if (!req.files || !req.files[0]) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    //validate authority from middleware authentication
    const auth = req?.auth;
    if (!auth) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const filePath = req.files[0].path;

    // Use the static method of batchLinkList model for bulk upload
    const insertedBatchLinkLists =
      await BatchLinkList.uploadBatchLinkListsFromCSV(filePath);
    console.log(`Inserted ${insertedBatchLinkLists?.length} batchLinkLists`);
    return res.status(201).send(insertedBatchLinkLists);
  } catch (error) {
    logger.log("error", `Error processing CSV file: ${error.message}`);
    return res.status(500).send({ message: "Failed to process CSV file" });
  }
};

//add new batchLinkList using mongoose
const addOneBatchLinkList = async (req, res) => {
  try {
    const { courseName, batchNumber, grade, startTime, endTime } = JSON.parse(
      req?.body?.data
    );
    if (!courseName || !batchNumber || !grade || !startTime || !endTime) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    //validate authority from middleware authentication
    const auth = req?.auth;
    if (!auth) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //create new batchLinkList object
    let updatedData = { courseName, batchNumber, grade, startTime, endTime };

    //add new batchLinkList
    const result = await BatchLinkList.createNewBatchLinkList(updatedData);
    if (result === null) {
      logger.log("error", "Failed to add batchLinkList!");
      return res.status(500).send({ message: "Failed to add batchLinkList!" });
    }
    logger.log("info", `Added a new batchLinkList: ${result}`);
    return res.status(201).send(result);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to add batchLinkList!" });
  }
};

// update One batchLinkList using mongoose
const updateOneBatchLinkList = async (req, res) => {
  try {
    const batchLinkListId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

    //object id validation
    if (!ValidObjectId(batchLinkListId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }
    let updatedData = { ...data };

    const updatedBatchLinkList = await BatchLinkList.updateBatchLinkListById(
      batchLinkListId,
      updatedData
    );
    if (updatedBatchLinkList === null) {
      return res.status(404).send({ message: "BatchLinkList not found" });
    }
    logger.log("info", `Updated batchLinkList: ${updatedBatchLinkList}`);
    if (!updatedBatchLinkList) {
      return res.status(500).json({ error: "Failed to update batchLinkList" });
    }
    return res.json({ success: true, updatedBatchLinkList });
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to update batchLinkList" });
  }
};

//delete one batchLinkList
const deleteOneBatchLinkListById = async (req, res) => {
  try {
    const batchLinkListId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(batchLinkListId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //to perform multiple filters at once
    const filter = {
      _id: batchLinkListId,
    };
    //delete batchLinkList
    const result = await BatchLinkList.deleteOne(filter);
    if (result?.deletedCount === 0) {
      logger.log(
        "error",
        `No batchLinkList found with this id: ${batchLinkListId}`
      );
      return res
        .status(404)
        .send({ message: "No batchLinkList found with this id!" });
    } else {
      logger.log("info", `batchLinkList deleted: ${batchLinkListId}`);
      return res.status(200).send({
        message: `batchLinkList deleted!`,
      });
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to delete batchLinkList!" });
  }
};

module.exports = {
  getAllBatchLinkLists,
  getOneBatchLinkList,
  uploadBatchLinkListsFromCSV,
  addOneBatchLinkList,
  updateOneBatchLinkList,
  deleteOneBatchLinkListById,
};
