// Controllers/TeacherController.js

const Teacher = require("../models/TeacherModel");
const { logger } = require("../services/loggers/Winston");
const { ValidObjectId } = require("../services/validators/ValidObjectId");

//get all Teacher using mongoose
const getAllTeachers = async (req, res) => {
  try {
    //perform query on database
    const teachers = await Teacher.getAllTeachers();
    if (teachers?.length === 0) {
      return res.status(200).send([]);
    }
    logger.log("info", `Found ${teachers?.length} teachers`);
    return res.status(200).send(teachers);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server Error" });
  }
};

//get single teacher using mongoose
const getOneTeacher = async (req, res) => {
  try {
    const teacherId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(teacherId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //perform query on database
    const teacher = await Teacher.getTeacherById(teacherId);
    if (!teacher) {
      return res.status(404).send({ message: "teacher not found" });
    } else {
      logger.log("info", JSON.stringify(teacher, null, 2));
      return res.status(200).send(teacher);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

const uploadTeachersFromCSV = async (req, res) => {
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

    // Use the static method of teacher model for bulk upload
    const insertedTeachers = await Teacher.uploadTeachersFromCSV(filePath);
    logger.log("info", `Inserted ${insertedTeachers?.length} teachers`);
    return res.status(201).send(insertedTeachers);
  } catch (error) {
    logger.log("error", `Error processing CSV file: ${error.message}`);
    return res.status(500).send({ message: "Failed to process CSV file" });
  }
};

//add new teacher using mongoose
const addOneTeacher = async (req, res) => {
  try {
    const { name, designation, workPlace, phone, email } = JSON.parse(
      req?.body?.data
    );
    // const { files } = req;
    if (!name || !designation || !workPlace) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    //validate authority from middleware authentication
    const auth = req?.auth;
    if (!auth) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //create new Teacher object
    let updatedData = {
      name,
      designation,
      workPlace,
      phone,
      email,
    };

    //add new teacher
    const result = await Teacher.createNewTeacher(updatedData);
    if (result === null) {
      logger.log("error", "Failed to add teacher!");
      return res.status(500).send({ message: "Failed to add teacher!" });
    }
    logger.log("info", `Added a new teacher: ${result}`);
    return res.status(201).send(result);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to add teacher!" });
  }
};

// update One teacher using mongoose
const updateOneTeacher = async (req, res) => {
  try {
    const teacherId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
    //object id validation
    if (!ValidObjectId(teacherId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }
    let updatedData = { ...data };

    const updatedTeacher = await Teacher.updateTeacherById(
      teacherId,
      updatedData
    );

    if (updatedTeacher === null) {
      return res.status(404).send({ message: "Teacher not found" });
    }
    logger.log("info", `Updated teacher: ${updatedTeacher}`);
    if (!updatedTeacher) {
      return res.status(500).json({ error: "Failed to update teacher" });
    }
    return res.json({ success: true, updatedTeacher });
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to update teache" });
  }
};

//delete one teacher
const deleteOneTeacherById = async (req, res) => {
  try {
    const teacherId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(teacherId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //to perform multiple filters at once
    const filter = {
      _id: teacherId,
    };
    //delete teacher
    const result = await Teacher.deleteOne(filter);
    if (result?.deletedCount === 0) {
      logger.log("error", `No teacher found with this id: ${teacherId}`);
      return res
        .status(404)
        .send({ message: "No teacher found with this id!" });
    } else {
      logger.log("info", `teacher deleted: ${teacherId}`);
      return res.status(200).send({
        message: `teacher deleted!`,
      });
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to delete teacher!" });
  }
};

module.exports = {
  getAllTeachers,
  getOneTeacher,
  uploadTeachersFromCSV,
  addOneTeacher,
  updateOneTeacher,
  deleteOneTeacherById,
};
