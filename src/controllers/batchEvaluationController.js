// Controllers/BatchEvaluationController.js

const BatchEvaluation = require("../models/BatchEvaluationModel");
const { logger } = require("../services/loggers/Winston");
const { ValidObjectId } = require("../services/validators/ValidObjectId");

//get all Batch using mongoose
const getAllBatchEvaluations = async (req, res) => {
  try {
    //perform query on database
    const evaluations = await BatchEvaluation.getAllEvaluations();
    if (evaluations?.length === 0) {
      return res.status(200).send([]);
    }
    logger.log("info", `Found ${evaluations?.length} evaluations`);
    return res.status(200).send(evaluations);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server Error" });
  }
};

//get single BatchEvaluation using mongoose
const getOneBatchEvaluation = async (req, res) => {
  try {
    const evaluationId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(evaluationId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //perform query on database
    const evaluation = await BatchEvaluation.getEvaluationById(evaluationId);
    if (!evaluation) {
      return res.status(404).send({ message: "Evaluation not found" });
    } else {
      logger.log("info", JSON.stringify(evaluation, null, 2));
      return res.status(200).send(evaluation);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

//get Batch Evaluations by batch id
const getBatchEvaluationsByBatchId = async (req, res) => {
  try {
    const batchId = req?.params?.batchId;

    //perform query on database
    const evaluations = await BatchEvaluation.getEvaluationsByBatchId(batchId);
    if (!evaluations) {
      return res.status(404).send({ message: "evaluations not found" });
    } else {
      logger.log("info", JSON.stringify(evaluations, null, 2));
      return res.status(200).send(evaluations);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

//get BatchEvaluations by batch number
const getBatchEvaluationsByCourseNameAndBatchNumber = async (req, res) => {
  try {
    const { batchNumber, courseName } = req?.query;
    if (!batchNumber || !courseName) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    //perform query on database
    const batchEvaluation =
      await BatchEvaluation.getEvaluationsByCourseNameAndBatchNumber(
        courseName,
        batchNumber
      );
    if (!batchEvaluation) {
      return res.status(404).send({ message: "BatchEvaluation not found" });
    } else {
      logger.log("info", JSON.stringify(batchEvaluation, null, 2));
      return res.status(200).send(batchEvaluation);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

//get BatchEvaluations by upload time
const getBatchEvaluationsByUploadTime = async (req, res) => {
  try {
    const createdAt = req?.params?.createdAt;

    //perform query on database
    const evaluations = await BatchEvaluation.getEvaluationsByUploadTime(
      createdAt
    );
    if (!evaluations) {
      return res.status(404).send({ message: "evaluations not found" });
    } else {
      logger.log("info", JSON.stringify(evaluations, null, 2));
      return res.status(200).send(evaluations);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

const uploadBatchEvaluationsFromCSV = async (req, res) => {
  try {
    const { batchId } = JSON.parse(req?.body?.data);
    if (!batchId) {
      return res.status(400).send({ message: "Missing required fields" });
    }
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

    // Use the static method of BatchEvaluation model for bulk upload
    const result = await BatchEvaluation.uploadEvaluationsFromCSV({
      filePath,
      batchId,
    });
    console.log(`Inserted ${result?.length} evaluations`);
    return res.status(201).send(result);
  } catch (error) {
    logger.log("error", `Error processing CSV file: ${error.message}`);
    return res.status(500).send({ message: "Failed to process CSV file" });
  }
};

//add new BatchEvaluation using mongoose
const addOneBatchEvaluation = async (req, res) => {
  try {
    const {
      batchId,
      batchNumber,
      courseName,
      startTime,
      endTime,
      studentId,
      studentName,
      studentRoll,
      // studentGrade,
      studentDesignation,
      studentWorkPlace,
      studentPhone,
      studentEmail,
      ratings,
      answers,
    } = JSON.parse(req?.body?.data);
    if (!batchId) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    //create new Batch evaluation object
    let updatedData = {
      batchId,
      batchNumber,
      courseName,
      startTime,
      endTime,
      studentId,
      studentName,
      studentRoll,
      // studentGrade,
      studentDesignation,
      studentWorkPlace,
      studentPhone,
      studentEmail,
      ratings,
      answers,
    };

    //check if evaluation already exists for thiis student on this batch id and batch nyumber
    const existingEvaluation =
      await BatchEvaluation.getEvaluationByStudentIdAndBatchId(
        studentId,
        batchId
      );
    if (existingEvaluation) {
      return res.status(400).send({ message: "Evaluation already exists" });
    }

    //add new Batch evaluation
    const result = await BatchEvaluation.createNewEvaluation(updatedData);
    if (result === null) {
      logger.log("error", "Failed to add evaluation!");
      return res.status(500).send({ message: "Failed to add evaluation!" });
    }
    logger.log("info", `Added a new evaluation: ${result}`);
    return res.status(201).send(result);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to add evaluation!" });
  }
};

// update One BatchEvaluation using mongoose
const updateOneBatchEvaluation = async (req, res) => {
  try {
    const evaluationId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
    //object id validation
    if (!ValidObjectId(evaluationId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }
    let updatedData = { ...data };

    const updatedEvaluation = await BatchEvaluation.updateEvaluationById(
      evaluationId,
      updatedData
    );

    if (updatedEvaluation === null) {
      return res.status(404).send({ message: "evaluation not found" });
    }
    logger.log("info", `Updated evaluation: ${updatedEvaluation}`);
    if (!updatedEvaluation) {
      return res.status(500).json({ error: "Failed to update evaluation " });
    }
    return res.json({ success: true, updatedEvaluation });
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to update evaluation " });
  }
};

//delete one BatchEvaluation
const deleteOneBatchEvaluationById = async (req, res) => {
  try {
    const evaluationId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(evaluationId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //to perform multiple filters at once
    const filter = {
      _id: evaluationId,
    };
    //delete evaluation
    const result = await BatchEvaluation.deleteOne(filter);
    if (result?.deletedCount === 0) {
      logger.log("error", `No evaluation found with this id: ${evaluationId}`);
      return res
        .status(404)
        .send({ message: "No evaluation found with this id!" });
    } else {
      logger.log("info", `evaluation deleted: ${evaluationId}`);
      return res.status(200).send({
        message: `evaluation deleted!`,
      });
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to delete evaluation!" });
  }
};

module.exports = {
  getAllBatchEvaluations,
  getOneBatchEvaluation,
  getBatchEvaluationsByBatchId,
  getBatchEvaluationsByCourseNameAndBatchNumber,
  getBatchEvaluationsByUploadTime,
  uploadBatchEvaluationsFromCSV,
  addOneBatchEvaluation,
  updateOneBatchEvaluation,
  deleteOneBatchEvaluationById,
};
