// Controllers/TeacherEvaluationController.js

const TeacherEvaluation = require("../models/TeacherEvaluationModel");
const { logger } = require("../services/loggers/Winston");
const { ValidObjectId } = require("../services/validators/ValidObjectId");

//get all Teacher using mongoose
const getAllTeacherEvaluations = async (req, res) => {
  try {
    //perform query on database
    const evaluations = await TeacherEvaluation.getAllEvaluations();
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

//get single TeacherEvaluation using mongoose
const getOneTeacherEvaluation = async (req, res) => {
  try {
    const evaluationId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(evaluationId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //perform query on database
    const evaluation = await TeacherEvaluation.getEvaluationById(evaluationId);
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

//get Teacher Evaluations by batch id
const getTeacherEvaluationsByBatchId = async (req, res) => {
  try {
    const batchId = req?.params?.batchId;

    //perform query on database
    const evaluations = await TeacherEvaluation.getEvaluationsByBatchId(
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

//get Teacher Evaluations by teacher id
const getTeacherEvaluationsByTeacherId = async (req, res) => {
  try {
    const teacherId = req?.params?.teacherId;

    //perform query on database
    const evaluations = await TeacherEvaluation.getEvaluationsByTeacherId(
      teacherId
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

//get Teacher Evaluations by student id
const getTeacherEvaluationsByStudentId = async (req, res) => {
  try {
    const studentId = req?.params?.studentId;

    //perform query on database
    const evaluations = await TeacherEvaluation.getEvaluationsByStudentId(
      studentId
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

//get TeacherEvaluations by upload time
const getTeacherEvaluationsByUploadTime = async (req, res) => {
  try {
    const createdAt = req?.params?.createdAt;

    //perform query on database
    const evaluations = await TeacherEvaluation.getEvaluationsByUploadTime(
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

//get TeacherEvaluations by evaluation code
const getTeacherEvaluationsByEvaluationCode = async (req, res) => {
  try {
    const evaluationCode = req?.params?.evaluationCode;

    //perform query on database
    const evaluations = await TeacherEvaluation.getEvaluationsByEvaluationCode(
      evaluationCode
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

const uploadTeacherEvaluationsFromCSV = async (req, res) => {
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

    // Use the static method of TeacherEvaluation model for bulk upload
    const result = await TeacherEvaluation.uploadEvaluationsFromCSV({
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

//add new TeacherEvaluation using mongoose
const addOneTeacherEvaluation = async (req, res) => {
  try {
    const {
      batchId,
      studentId,
      studentName,
      studentRoll,
      studentDesignation,
      studentWorkPlace,
      studentPhone,
      studentEmail,
      teacherId,
      teacherName,
      teacherDesignation,
      teacherWorkPlace,
      teacherPhone,
      teacherEmail,
      topic,
      rating,
      classDuration,
      evaluationCode,
    } = JSON.parse(req?.body?.data);
    if (
      !batchId ||
      !studentId ||
      !studentName ||
      !studentRoll ||
      !studentDesignation ||
      !studentWorkPlace ||
      !studentPhone ||
      !studentEmail ||
      !teacherId ||
      !teacherName ||
      !teacherDesignation ||
      !teacherWorkPlace ||
      !teacherPhone ||
      !teacherEmail ||
      !topic ||
      !rating ||
      !classDuration ||
      !evaluationCode
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    //validate authority from middleware authentication
    const auth = req?.auth;
    if (!auth) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //check if evaluation of this student for this batch and batch number already exists
    const evaluationExists =
      await TeacherEvaluation.getEvaluationByStudentIdAndBatchId(
        studentId,
        batchId
      );
    if (evaluationExists) {
      return res.status(400).send({
        message: "Evaluation for this student and batch already exists",
      });
    }

    //create new Teacher evaluation object
    let updatedData = {
      batchId,
      studentId,
      studentName,
      studentRoll,
      studentDesignation,
      studentWorkPlace,
      studentPhone,
      studentEmail,
      teacherId,
      teacherName,
      teacherDesignation,
      teacherWorkPlace,
      teacherPhone,
      teacherEmail,
      topic,
      rating,
      classDuration,
      evaluationCode,
    };

    //add new Teacher evaluation
    const result = await TeacherEvaluation.createNewEvaluation(updatedData);
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

// update One TeacherEvaluation using mongoose
const updateOneTeacherEvaluation = async (req, res) => {
  try {
    const evaluationId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
    //object id validation
    if (!ValidObjectId(evaluationId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }
    let updatedData = { ...data };

    const updatedEvaluation = await TeacherEvaluation.updateEvaluationById(
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

//delete one TeacherEvaluation
const deleteOneTeacherEvaluationById = async (req, res) => {
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
    const result = await TeacherEvaluation.deleteOne(filter);
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
};
