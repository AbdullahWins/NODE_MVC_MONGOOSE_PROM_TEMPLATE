// Controllers/CourseController.js

const Course = require("../models/CourseModel");
const { logger } = require("../services/loggers/Winston");
const { validObjectId } = require("../services/validators/ValidObjectId");

//get all Course using mongoose
const getAllCourses = async (req, res) => {
  try {
    //perform query on database
    const courses = await Course.getAllCourses();
    if (courses?.length === 0) {
      return res.status(200).send([]);
    }
    logger.log("info", `Found ${courses?.length} courses`);
    return res.status(200).send(courses);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server Error" });
  }
};

//get single Course using mongoose
const getOneCourse = async (req, res) => {
  try {
    const courseId = req?.params?.id;
    //object id validation
    if (!validObjectId(courseId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //perform query on database
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).send({ message: "course not found" });
    } else {
      logger.log("info", JSON.stringify(course, null, 2));
      return res.status(200).send(course);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

const uploadCoursesFromCSV = async (req, res) => {
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

    // Use the static method of Course model for bulk upload
    const insertedCourses = await Course.uploadCoursesFromCSV(filePath);
    console.log(`Inserted ${insertedCourses?.length} courses`);
    return res.status(201).send(insertedCourses);
  } catch (error) {
    logger.log("error", `Error processing CSV file: ${error.message}`);
    return res.status(500).send({ message: "Failed to process CSV file" });
  }
};

//add new Course using mongoose
const addOneCourse = async (req, res) => {
  try {
    const { courseName } = JSON.parse(req?.body?.data);
    if (!courseName) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    //validate authority from middleware authentication
    const auth = req?.auth;
    if (!auth) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //create new Course object
    let updatedData = { courseName };

    //add new course
    const result = await Course.createNewCourse(updatedData);
    if (result === null) {
      logger.log("error", "Failed to add course!");
      return res.status(500).send({ message: "Failed to add course!" });
    }
    logger.log("info", `Added a new course: ${result}`);
    return res.status(201).send(result);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to add course!" });
  }
};

// update One course using mongoose
const updateOneCourse = async (req, res) => {
  try {
    const courseId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

    //object id validation
    if (!validObjectId(courseId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }
    let updatedData = { ...data };

    const updatedCourse = await Course.updateCourseById(courseId, updatedData);
    if (updatedCourse === null) {
      return res.status(404).send({ message: "Course not found" });
    }
    logger.log("info", `Updated course: ${updatedCourse}`);
    if (!updatedCourse) {
      return res.status(500).json({ error: "Failed to update course " });
    }
    return res.json({ success: true, updatedCourse });
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to update course " });
  }
};

//delete one course
const deleteOneCourseById = async (req, res) => {
  try {
    const courseId = req?.params?.id;
    //object id validation
    if (!validObjectId(courseId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //to perform multiple filters at once
    const filter = {
      _id: courseId,
    };
    //delete course
    const result = await Course.deleteOne(filter);
    if (result?.deletedCount === 0) {
      logger.log("error", `No course found with this id: ${courseId}`);
      return res.status(404).send({ message: "No course found with this id!" });
    } else {
      logger.log("info", `course deleted: ${courseId}`);
      return res.status(200).send({
        message: `course deleted!`,
      });
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to delete course!" });
  }
};

module.exports = {
  getAllCourses,
  getOneCourse,
  uploadCoursesFromCSV,
  addOneCourse,
  updateOneCourse,
  deleteOneCourseById,
};
