const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const csv = require("csv-parser");
const fs = require("fs");

const topicSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  topicName: {
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

// Add a static method for topic count
topicSchema.statics.getTopicCount = async function () {
  try {
    const topicCount = await this.countDocuments();
    return topicCount;
  } catch (error) {
    throw error;
  }
};

// Add a static method for bulk upload
topicSchema.statics.uploadTopicsFromCSV = async function (filePath) {
  try {
    const topicsToInsert = [];

    // Read CSV file and process data
    const insertedTopics = await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          // Process data as needed
          const topic = new this({
            topicName: row.topicName || "",
          });
          // Append processed data to list
          topicsToInsert.push(topic);
        })
        .on("end", async () => {
          // Insert topics to MongoDB
          if (topicsToInsert.length > 0) {
            try {
              const insertedTopics = await this.insertMany(topicsToInsert);
              resolve(insertedTopics);
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

    return insertedTopics;
  } catch (error) {
    throw error;
  }
};

//create a new topic
topicSchema.statics.createNewTopic = async function (topicData) {
  try {
    const newTopic = new this(topicData);
    const savedTopic = await newTopic.save();
    return savedTopic;
  } catch (error) {
    throw error;
  }
};

//get all Topic
topicSchema.statics.getAllTopics = async function () {
  try {
    const topics = await this.find();
    return topics;
  } catch (error) {
    throw error;
  }
};

//get single Topic
topicSchema.statics.getTopicById = async function (topicId) {
  try {
    const topic = await this.findById(topicId);
    return topic;
  } catch (error) {
    throw error;
  }
};

//update topic
topicSchema.statics.updateTopicById = async function (topicId, updatedData) {
  try {
    const updatedTopic = await this.findByIdAndUpdate(
      (_id = topicId),
      updatedData,
      //return the updated document
      { new: true }
    );
    return updatedTopic;
  } catch (error) {
    throw error;
  }
};

//delete ad service by id
topicSchema.statics.deleteTopicById = async function (topicId) {
  try {
    const deletedTopic = await this.findByIdAndRemove(topicId);
    return deletedTopic;
  } catch (error) {
    throw error;
  }
};

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
