const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const csv = require("csv-parser");
const fs = require("fs");

const teacherSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: {
    type: String,
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
  phone: String,
  email: String,
  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

// Add a static method for counting teachers
teacherSchema.statics.getTeacherCount = async function () {
  try {
    const teacherCount = await this.countDocuments();
    return teacherCount;
  } catch (error) {
    throw error;
  }
};

// Add a static method for bulk upload
teacherSchema.statics.uploadTeachersFromCSV = async function (filePath) {
  try {
    const teachersToInsert = [];

    // Read CSV file and process data
    const insertedTeachers = await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          // Process data as needed
          const teacher = new this({
            name: row.name || "",
            roll: row.roll || "",
            designation: row.designation || "",
            workPlace: row.workPlace || "",
            phone: row.phone || "",
            email: row.email || "",
          });
          // Append processed data to list
          teachersToInsert.push(teacher);
        })
        .on("end", async () => {
          // Insert teachers to MongoDB
          if (teachersToInsert.length > 0) {
            try {
              const insertedTeachers = await this.insertMany(teachersToInsert);
              resolve(insertedTeachers);
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

    return insertedTeachers;
  } catch (error) {
    throw error;
  }
};

//create a new teacher
teacherSchema.statics.createNewTeacher = async function (teacherData) {
  try {
    const newTeacher = new this(teacherData);
    const savedTeacher = await newTeacher.save();
    return savedTeacher;
  } catch (error) {
    throw error;
  }
};

//get all Teacher
teacherSchema.statics.getAllTeachers = async function () {
  try {
    const teachers = await this.find();
    return teachers;
  } catch (error) {
    throw error;
  }
};

//get single teacher
teacherSchema.statics.getTeacherById = async function (teacherId) {
  try {
    const teacher = await this.findById(teacherId);
    return teacher;
  } catch (error) {
    throw error;
  }
};

//update teacher
teacherSchema.statics.updateTeacherById = async function (
  teacherId,
  updatedData
) {
  try {
    const updatedTeacher = await this.findByIdAndUpdate(
      (_id = teacherId),
      updatedData,
      //return the updated document
      { new: true }
    );
    return updatedTeacher;
  } catch (error) {
    throw error;
  }
};

//delete ad service by id
teacherSchema.statics.deleteTeacherById = async function (teacherId) {
  try {
    const deletedTeacher = await this.findByIdAndRemove(teacherId);
    return deletedTeacher;
  } catch (error) {
    throw error;
  }
};

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
