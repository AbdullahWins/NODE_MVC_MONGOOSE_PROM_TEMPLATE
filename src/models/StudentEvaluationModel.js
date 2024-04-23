const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const csv = require("csv-parser");
const fs = require("fs");

const studentEvaluationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  workPlace: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  module1: {
    type: Number,
    required: true,
  },
  module2: {
    type: Number,
    required: true,
  },
  module3: {
    type: Number,
    required: true,
  },
  module4: {
    type: Number,
    required: true,
  },
  module5: {
    type: Number,
    required: true,
  },
  module6: {
    type: Number,
    required: true,
  },
  attendance: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
  },
  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

// Add a static method for bulk upload
studentEvaluationSchema.statics.uploadEvaluationsFromCSV = async function ({
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
            name: row.name || "",
            roll: row.roll || "",
            designation: row.designation || "",
            workPlace: row.workPlace || "",
            phone: row.phone || "",
            email: row.email || "",
            module1: row.module1 || 0,
            module2: row.module2 || 0,
            module3: row.module3 || 0,
            module4: row.module4 || 0,
            module5: row.module5 || 0,
            module6: row.module6 || 0,
            attendance: row.attendance || 0,
            total: row.total || 0,
            // rank: row.rank || 0,
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
studentEvaluationSchema.statics.createNewEvaluation = async function (
  evaluationData
) {
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
studentEvaluationSchema.statics.getAllEvaluations = async function () {
  try {
    const evaluations = await this.find().populate("batchId");
    return evaluations;
  } catch (error) {
    throw error;
  }
};

//get single evaluation
studentEvaluationSchema.statics.getEvaluationById = async function (
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
studentEvaluationSchema.statics.getEvaluationsByBatchId = async function (
  batchId
) {
  try {
    const evaluationsByBatchNumber = await this.find({
      batchId: batchId,
    }).populate("batchId");

    //calculate and add rank based on total value
    evaluationsByBatchNumber.sort((a, b) => b.total - a.total);
    evaluationsByBatchNumber.forEach((evaluation, index) => {
      evaluation.rank = index + 1;
    });

    //now sort by roll number
    evaluationsByBatchNumber.sort((a, b) => a.roll - b.roll);
    return evaluationsByBatchNumber;
  } catch (error) {
    throw error;
  }
};

//get top 3 evaluations with rank by batch id
studentEvaluationSchema.statics.getTopEvaluationsByBatchId = async function (
  batchId
) {
  try {
    const topRanking = 3;
    const topEvaluations = await this.find({ batchId: batchId })
      .sort({ rank: 1 })
      .limit(topRanking)
      .populate("batchId");
    return topEvaluations;
  } catch (error) {
    throw error;
  }
};

//get top 3 based on total numbers evaluations by batch id
studentEvaluationSchema.statics.getTopEvaluationsByTotal = async function (
  batchId
) {
  try {
    const topRanking = 3;
    const topEvaluations = await this.find({ batchId: batchId })
      .sort({ total: -1 })
      .limit(topRanking)
      .populate("batchId");
    topEvaluations.forEach((evaluation, index) => {
      evaluation.rank = index + 1;
    });
    return topEvaluations;
  } catch (error) {
    throw error;
  }
};

//get evaluations by upload time
studentEvaluationSchema.statics.getEvaluationsByUploadTime = async function (
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
studentEvaluationSchema.statics.updateEvaluationById = async function (
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
studentEvaluationSchema.statics.deleteEvaluationById = async function (
  evaluationId
) {
  try {
    const deletedEvaluation = await this.findByIdAndRemove(evaluationId);
    return deletedEvaluation;
  } catch (error) {
    throw error;
  }
};

const StudentEvaluation = mongoose.model(
  "StudentEvaluation",
  studentEvaluationSchema
);

module.exports = StudentEvaluation;
