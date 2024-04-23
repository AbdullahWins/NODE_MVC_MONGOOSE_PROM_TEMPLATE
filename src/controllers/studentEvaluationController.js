// Controllers/StudentEvaluationController.js

const StudentEvaluation = require("../models/StudentEvaluationModel");
const { logger } = require("../services/loggers/Winston");
const { ValidObjectId } = require("../services/validators/ValidObjectId");

//get all Student using mongoose
const getAllStudentEvaluations = async (req, res) => {
  try {
    //perform query on database
    const evaluations = await StudentEvaluation.getAllEvaluations();
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

//get single StudentEvaluation using mongoose
const getOneStudentEvaluation = async (req, res) => {
  try {
    const evaluationId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(evaluationId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //perform query on database
    const evaluation = await StudentEvaluation.getEvaluationById(evaluationId);
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

//get Student Evaluations by batch Id
const getStudentEvaluationsByBatchId = async (req, res) => {
  try {
    const batchId = req?.params?.batchId;

    //perform query on database
    const evaluations = await StudentEvaluation.getEvaluationsByBatchId(
      batchId
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

//get top Student Evaluations by batch Id
const getTopStudentEvaluationsByBatchId = async (req, res) => {
  try {
    const batchId = req?.params?.batchId;

    //perform query on database
    const evaluations = await StudentEvaluation.getTopEvaluationsByTotal(
      batchId
    );
    if (!evaluations) {
      return res.status(404).send({ message: "Top evaluations not found" });
    } else {
      logger.log("info", JSON.stringify(evaluations, null, 2));
      return res.status(200).send(evaluations);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

//get StudentEvaluations by upload time
const getStudentEvaluationsByUploadTime = async (req, res) => {
  try {
    const createdAt = req?.params?.createdAt;

    //perform query on database
    const evaluations = await StudentEvaluation.getEvaluationsByUploadTime(
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

const uploadStudentEvaluationsFromCSV = async (req, res) => {
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

    // Use the static method of StudentEvaluation model for bulk upload
    const result = await StudentEvaluation.uploadEvaluationsFromCSV({
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

//add new StudentEvaluation using mongoose
const addOneStudentEvaluation = async (req, res) => {
  try {
    const {
      batchId,
      name,
      roll,
      designation,
      workPlace,
      phone,
      email,
      module1,
      module2,
      module3,
      module4,
      module5,
      module6,
      attendance,
      total,
      // rank,
    } = JSON.parse(req?.body?.data);
    if (
      !batchId ||
      !name ||
      !roll ||
      !designation ||
      !workPlace ||
      !phone ||
      !email ||
      !module1 ||
      !module2 ||
      !module3 ||
      !module4 ||
      !module5 ||
      !module6 ||
      !attendance ||
      !total
      // !rank
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    //validate authority from middleware authentication
    const auth = req?.auth;
    if (!auth) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //create new student evaluation object
    let updatedData = {
      batchId,
      name,
      roll,
      designation,
      workPlace,
      phone,
      email,
      module1,
      module2,
      module3,
      module4,
      module5,
      module6,
      attendance,
      total,
      // rank,
    };

    //add new student evaluation
    const result = await StudentEvaluation.createNewEvaluation(updatedData);
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

// update One StudentEvaluation using mongoose
const updateOneStudentEvaluation = async (req, res) => {
  try {
    const evaluationId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
    //object id validation
    if (!ValidObjectId(evaluationId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }
    let updatedData = { ...data };

    const updatedEvaluation = await StudentEvaluation.updateEvaluationById(
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

//delete one StudentEvaluation
const deleteOneStudentEvaluationById = async (req, res) => {
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
    const result = await StudentEvaluation.deleteOne(filter);
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
  getAllStudentEvaluations,
  getOneStudentEvaluation,
  getStudentEvaluationsByBatchId,
  getTopStudentEvaluationsByBatchId,
  getStudentEvaluationsByUploadTime,
  uploadStudentEvaluationsFromCSV,
  addOneStudentEvaluation,
  updateOneStudentEvaluation,
  deleteOneStudentEvaluationById,
};
