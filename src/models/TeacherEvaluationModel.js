const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const csv = require("csv-parser");
const fs = require("fs");

const teacherEvaluationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
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
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  teacherDesignation: {
    type: String,
    required: true,
  },
  teacherWorkPlace: {
    type: String,
    required: true,
  },
  teacherPhone: {
    type: String,
    required: true,
  },
  teacherEmail: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  classDuration: {
    type: String,
    required: true,
  },
  evaluationCode: {
    type: String,
    default: () => {
      //today's date
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let today = `${day}-${month}-${year}`;
      return today;
    },
  },
  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

// Add a static method for counting evaluations
teacherEvaluationSchema.statics.getTeacherEvaluationCount = async function () {
  try {
    const evaluationCount = await this.countDocuments();
    return evaluationCount;
  } catch (error) {
    throw error;
  }
};

// Add a static method for bulk upload
teacherEvaluationSchema.statics.uploadEvaluationsFromCSV = async function ({
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
            studentId: row.studentId || "",
            studentName: row.studentName || "",
            studentRoll: row.studentRoll || "",
            studentDesignation: row.studentDesignation || "",
            studentWorkPlace: row.studentWorkPlace || "",
            studentPhone: row.studentPhone || "",
            studentEmail: row.studentEmail || "",
            teacherId: row.teacherId || "",
            teacherName: row.teacherName || "",
            teacherDesignation: row.teacherDesignation || "",
            teacherWorkPlace: row.teacherWorkPlace || "",
            teacherPhone: row.teacherPhone || "",
            teacherEmail: row.teacherEmail || "",
            topic: row.topic || "",
            rating: row.rating || 3,
            evaluationCode: row.evaluationCode || "",
          });
          // Append processed data to list
          evaluationsToInsert.push(evaluation);
        })
        .on("end", async () => {
          // Insert evaluations to MongoDB
          if (evaluationsToInsert?.length > 0) {
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
teacherEvaluationSchema.statics.createNewEvaluation = async function (
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
teacherEvaluationSchema.statics.getAllEvaluations = async function () {
  try {
    const evaluations = await this.find()
      .populate("batchId")
      .populate("studentId")
      .populate("teacherId");
    return evaluations;
  } catch (error) {
    throw error;
  }
};

//get single evaluation
teacherEvaluationSchema.statics.getEvaluationById = async function (
  evaluationId
) {
  try {
    const evaluation = await this.findById(evaluationId).populate("batchId");
    return evaluation;
  } catch (error) {
    throw error;
  }
};

//get evaluations by batch number
teacherEvaluationSchema.statics.getEvaluationsByBatchNumber = async function (
  batchNumber
) {
  try {
    // Fetch all students
    const evaluations = await this.find().populate("batchId");
    // Filter students by batch number
    const evaluationsByBatchNumber = evaluations.filter((evaluation) => {
      return evaluation?.batchId?.batchNumber === batchNumber;
    });

    return evaluationsByBatchNumber;
  } catch (error) {
    throw error;
  }
};

//get evaluations by batch id
teacherEvaluationSchema.statics.getEvaluationsByBatchId = async function (
  batchId
) {
  try {
    const evaluationsByBatchId = await this.find({
      batchId: batchId,
    })
      .populate("batchId")
      .populate("studentId")
      .populate("teacherId");
    return evaluationsByBatchId;
  } catch (error) {
    throw error;
  }
};

//get evaluations by teacher id
teacherEvaluationSchema.statics.getEvaluationsByTeacherId = async function (
  teacherId
) {
  try {
    const evaluations = await this.find({ teacherId: teacherId })
      .populate("batchId")
      .populate("studentId")
      .populate("teacherId");
    return evaluations;
  } catch (error) {
    throw error;
  }
};

//get evaluations by student id
teacherEvaluationSchema.statics.getEvaluationsByStudentId = async function (
  studentId
) {
  try {
    const evaluations = await this.find({ studentId: studentId })
      .populate("batchId")
      .populate("studentId")
      .populate("teacherId");
    return evaluations;
  } catch (error) {
    throw error;
  }
};

//get evaluations by student id and batch id
teacherEvaluationSchema.statics.getEvaluationByStudentIdAndBatchId =
  async function (studentId, batchId) {
    try {
      const evaluation = await this.findOne({
        studentId: studentId,
        batchId: batchId,
      })
        .populate("batchId")
        .populate("studentId")
        .populate("teacherId");
      return evaluation;
    } catch (error) {
      throw error;
    }
  };

//get evaluations by upload time
teacherEvaluationSchema.statics.getEvaluationsByUploadTime = async function (
  createdAt
) {
  try {
    const evaluations = await this.find({ createdAt: createdAt })
      .populate("batchId")
      .populate("studentId")
      .populate("teacherId");
    return evaluations;
  } catch (error) {
    throw error;
  }
};

//get evaluations by evaluation code
teacherEvaluationSchema.statics.getEvaluationsByEvaluationCode =
  async function (evaluationCode) {
    try {
      const evaluations = await this.find({
        evaluationCode: evaluationCode,
      })
        .populate("batchId")
        .populate("studentId")
        .populate("teacherId");
      return evaluations;
    } catch (error) {
      throw error;
    }
  };

//update evaluation
teacherEvaluationSchema.statics.updateEvaluationById = async function (
  evaluationId,
  updatedData
) {
  try {
    const updatedEvaluation = await this.findByIdAndUpdate(
      (_id = evaluationId),
      updatedData,
      //return the updated document
      { new: true }
    )
      .populate("batchId")
      .populate("studentId")
      .populate("teacherId");
    return updatedEvaluation;
  } catch (error) {
    throw error;
  }
};

//delete ad service by id
teacherEvaluationSchema.statics.deleteEvaluationById = async function (
  evaluationId
) {
  try {
    const deletedEvaluation = await this.findByIdAndRemove(evaluationId);
    return deletedEvaluation;
  } catch (error) {
    throw error;
  }
};

const TeacherEvaluation = mongoose.model(
  "TeacherEvaluation",
  teacherEvaluationSchema
);

module.exports = TeacherEvaluation;
