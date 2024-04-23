const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const csv = require("csv-parser");
const fs = require("fs");

const batchLinkListSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  courseName: {
    type: String,
    required: true,
  },
  batchNumber: {
    type: String,
    required: true,
  },
  grade: {
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
  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

// Add a static method for bulk upload
batchLinkListSchema.statics.uploadBatchLinkListsFromCSV = async function (
  filePath
) {
  try {
    const batchLinkListsToInsert = [];

    // Read CSV file and process data
    const insertedBatchLinkLists = await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          // Process data as needed
          const batchLinkList = new this({
            courseName: row.courseName || "",
            batchNumber: row.batchNumber || "",
            grade: row.grade || "",
            startTime: row.startTime || "",
            endTime: row.endTime || "",
          });
          // Append processed data to list
          batchLinkListsToInsert.push(batchLinkList);
        })
        .on("end", async () => {
          // Insert batchLinkLists to MongoDB
          if (batchLinkListsToInsert.length > 0) {
            try {
              const insertedBatchLinkLists = await this.insertMany(
                batchLinkListsToInsert
              );
              resolve(insertedBatchLinkLists);
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

    return insertedBatchLinkLists;
  } catch (error) {
    throw error;
  }
};

//create a new batchLinkList
batchLinkListSchema.statics.createNewBatchLinkList = async function (
  batchLinkListData
) {
  try {
    const newBatchLinkList = new this(batchLinkListData);
    const savedBatchLinkList = await newBatchLinkList.save();
    return savedBatchLinkList;
  } catch (error) {
    throw error;
  }
};

//get all BatchLinkList
batchLinkListSchema.statics.getAllBatchLinkLists = async function () {
  try {
    const batchLinkLists = await this.find();
    return batchLinkLists;
  } catch (error) {
    throw error;
  }
};

//get single BatchLinkList
batchLinkListSchema.statics.getBatchLinkListById = async function (
  batchLinkListId
) {
  try {
    const batchLinkList = await this.findById(batchLinkListId);
    return batchLinkList;
  } catch (error) {
    throw error;
  }
};

//update batchLinkList
batchLinkListSchema.statics.updateBatchLinkListById = async function (
  batchLinkListId,
  updatedData
) {
  try {
    const updatedBatchLinkList = await this.findByIdAndUpdate(
      (_id = batchLinkListId),
      updatedData,
      //return the updated document
      { new: true }
    );
    return updatedBatchLinkList;
  } catch (error) {
    throw error;
  }
};

//delete ad service by id
batchLinkListSchema.statics.deleteBatchLinkListById = async function (
  batchLinkListId
) {
  try {
    const deletedBatchLinkList = await this.findByIdAndRemove(batchLinkListId);
    return deletedBatchLinkList;
  } catch (error) {
    throw error;
  }
};

const BatchLinkList = mongoose.model("BatchLinkList", batchLinkListSchema);

module.exports = BatchLinkList;
