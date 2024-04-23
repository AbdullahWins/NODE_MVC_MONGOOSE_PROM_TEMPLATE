const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const csv = require("csv-parser");
const fs = require("fs");

const ratingSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
});

const answerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answers: { type: [String], required: true },
});

const batchEvaluationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  batchNumber: {
    type: String,
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentRoll: {
    type: String,
    required: true,
  },
  // studentGrade: {
  //   type: String,
  //   required: true,
  // },
  studentDesignation: {
    type: String,
    required: true,
  },
  studentWorkPlace: {
    type: String,
    required: true,
  },
  studentPhone: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  ratings: { type: [ratingSchema], required: true },
  answers: { type: [answerSchema], required: true },
  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

// Add a static method for bulk upload
batchEvaluationSchema.statics.uploadEvaluationsFromCSV = async function ({
  filePath,
  batchId,
}) {
  try {
    const evaluationsToInsert = [];

    // Read CSV file and process data
    const insertedEvaluations = await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          // Process data as needed
          const evaluation = new this({
            batchId: batchId || "",
            courseName: row.courseName || "",
            batchNumber: row.batchNumber || "",
            startTime: row.startTime || "",
            endTime: row.endTime || "",
            studentId: row.studentId || "",
            studentName: row.studentName || "",
            studentRoll: row.studentRoll || "",
            // studentGrade: row.studentGrade || "",
            studentDesignation: row.studentDesignation || "",
            studentWorkPlace: row.studentWorkPlace || "",
            studentPhone: row.studentPhone || "",
            studentEmail: row.studentEmail || "",
            ratings: row.ratings || [],
            answers: row.answers || [],
          });
          // Append processed data to list
          evaluationsToInsert.push(evaluation);
        })
        .on("end", async () => {
          // Insert evaluations to MongoDB
          if (evaluationsToInsert.length > 0) {
            try {
              const insertedEvaluations = await this.insertMany(
                evaluationsToInsert
              );
              resolve(insertedEvaluations);
            } catch (error) {
              reject(error);
            }
          } else {
            resolve([]);
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    return insertedEvaluations;
  } catch (error) {
    throw error;
  }
};

//create a new evaluation
batchEvaluationSchema.statics.createNewEvaluation = async function (
  evaluationData
) {
  console.log("evaluationData", evaluationData);
  try {
    const newEvaluation = new this(evaluationData);
    const savedEvaluation = await newEvaluation.save();
    // Populate the batchId field for the saved evaluation
    await this.populate(savedEvaluation, { path: "batchId" });
    return savedEvaluation;
  } catch (error) {
    throw error;
  }
};

//get all evaluation
batchEvaluationSchema.statics.getAllEvaluations = async function () {
  try {
    const evaluations = await this.find().populate("batchId");
    return evaluations;
  } catch (error) {
    throw error;
  }
};

//get single evaluation
batchEvaluationSchema.statics.getEvaluationById = async function (
  evaluationId
) {
  try {
    const evaluation = await this.findById(evaluationId).populate("batchId");
    return evaluation;
  } catch (error) {
    throw error;
  }
};

//get evaluations by batch id
batchEvaluationSchema.statics.getEvaluationsByBatchId = async function (
  batchId
) {
  try {
    const query = { batchId: batchId };
    const evaluationsByBatchId = await this.find(query).populate("batchId");
    return evaluationsByBatchId;
  } catch (error) {
    throw error;
  }
};

//get evaluations by course name and batch number
batchEvaluationSchema.statics.getEvaluationsByCourseNameAndBatchNumber =
  async function (courseName, batchNumber) {
    try {
      const evaluations = await this.find({
        courseName: courseName,
        batchNumber: batchNumber,
      }).populate("batchId");
      return evaluations;
    } catch (error) {
      throw error;
    }
  };

//get evaluations by student id and batch id
batchEvaluationSchema.statics.getEvaluationByStudentIdAndBatchId =
  async function (studentId, batchId) {
    try {
      const evaluation = await this.findOne({
        studentId: studentId,
        batchId: batchId,
      }).populate("batchId");
      return evaluation;
    } catch (error) {
      throw error;
    }
  };

//get evaluations by upload time
batchEvaluationSchema.statics.getEvaluationsByUploadTime = async function (
  createdAt
) {
  try {
    const evaluations = await this.find({ createdAt: createdAt }).populate(
      "batchId"
    );
    return evaluations;
  } catch (error) {
    throw error;
  }
};

//update evaluation
batchEvaluationSchema.statics.updateEvaluationById = async function (
  evaluationId,
  updatedData
) {
  try {
    const updatedEvaluation = await this.findByIdAndUpdate(
      (_id = evaluationId),
      updatedData,
      //return the updated document
      { new: true }
    ).populate("batchId");
    return updatedEvaluation;
  } catch (error) {
    throw error;
  }
};

//delete ad service by id
batchEvaluationSchema.statics.deleteEvaluationById = async function (
  evaluationId
) {
  try {
    const deletedEvaluation = await this.findByIdAndRemove(evaluationId);
    return deletedEvaluation;
  } catch (error) {
    throw error;
  }
};

const BatchEvaluation = mongoose.model(
  "BatchEvaluation",
  batchEvaluationSchema
);

module.exports = BatchEvaluation;
