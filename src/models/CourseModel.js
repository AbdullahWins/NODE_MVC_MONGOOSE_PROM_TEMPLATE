const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const csv = require("csv-parser");
const fs = require("fs");

const courseSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  courseName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

// Add a static method for counting courses
courseSchema.statics.getCourseCount = async function () {
  try {
    const courseCount = await this.countDocuments();
    return courseCount;
  } catch (error) {
    throw error;
  }
};

// Add a static method for bulk upload
courseSchema.statics.uploadCoursesFromCSV = async function (filePath) {
  try {
    const coursesToInsert = [];

    // Read CSV file and process data
    const insertedCourses = await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          // Process data as needed
          const course = new this({
            courseName: row.courseName || "",
          });
          // Append processed data to list
          coursesToInsert.push(course);
        })
        .on("end", async () => {
          // Insert courses to MongoDB
          if (coursesToInsert.length > 0) {
            try {
              const insertedCourses = await this.insertMany(coursesToInsert);
              resolve(insertedCourses);
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

    return insertedCourses;
  } catch (error) {
    throw error;
  }
};

//create a new Course
courseSchema.statics.createNewCourse = async function (courseData) {
  try {
    const newCourse = new this(courseData);
    const savedCourse = await newCourse.save();
    return savedCourse;
  } catch (error) {
    throw error;
  }
};

//get all Course
courseSchema.statics.getAllCourses = async function () {
  try {
    const courses = await this.find();
    return courses;
  } catch (error) {
    throw error;
  }
};

//get single course
courseSchema.statics.getCourseById = async function (courseId) {
  try {
    const course = await this.findById(courseId);
    return course;
  } catch (error) {
    throw error;
  }
};

//update course
courseSchema.statics.updateCourseById = async function (courseId, updatedData) {
  try {
    const updatedCourse = await this.findByIdAndUpdate(
      (_id = courseId),
      updatedData,
      //return the updated document
      { new: true }
    );
    return updatedCourse;
  } catch (error) {
    throw error;
  }
};

//delete ad service by id
courseSchema.statics.deleteCourseById = async function (courseId) {
  try {
    const deletedCourse = await this.findByIdAndRemove(courseId);
    return deletedCourse;
  } catch (error) {
    throw error;
  }
};

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
