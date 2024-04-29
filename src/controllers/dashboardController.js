// Controllers/CourseController.js

const Batch = require("../models/BatchModel");
const Course = require("../models/CourseModel");
const Student = require("../models/StudentModel");
const TeacherEvaluation = require("../models/TeacherEvaluationModel");
const Teacher = require("../models/TeacherModel");
const Topic = require("../models/TopicModel");

const { logger } = require("../services/loggers/Winston");
// const { validObjectId } = require("../services/validators/ValidObjectId");

//get all Course using mongoose
const getDashboardData = async (req, res) => {
  try {
    //perform query on database
    const courseCount = await Course.getCourseCount();
    // const classCount = await Course.getClassCount();
    const topicCount = await Topic.getTopicCount();
    const studentsCount = await Student.getStudentCount();
    const teachersCount = await Teacher.getTeacherCount();
    const batchCount = await Batch.getBatchCount();
    const teacherEvaluationCount =
      await TeacherEvaluation.getTeacherEvaluationCount();

    const dashboardData = {
      courseCount,
      topicCount,
      studentsCount,
      teachersCount,
      batchCount,
      teacherEvaluationCount,
    };

    logger.log("info", dashboardData);
    return res.status(200).send(dashboardData);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server Error" });
  }
};

module.exports = { getDashboardData };
