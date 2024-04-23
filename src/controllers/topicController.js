// Controllers/TopicController.js

const Topic = require("../models/TopicModel");
const { logger } = require("../services/loggers/Winston");
const { ValidObjectId } = require("../services/validators/ValidObjectId");

//get all Topic using mongoose
const getAllTopics = async (req, res) => {
  try {
    //perform query on database
    const topics = await Topic.getAllTopics();
    if (topics?.length === 0) {
      return res.status(200).send([]);
    }
    logger.log("info", `Found ${topics?.length} topics`);
    return res.status(200).send(topics);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server Error" });
  }
};

//get single Topic using mongoose
const getOneTopic = async (req, res) => {
  try {
    const topicId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(topicId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //perform query on database
    const topic = await Topic.getTopicById(topicId);
    if (!topic) {
      return res.status(404).send({ message: "topic not found" });
    } else {
      logger.log("info", JSON.stringify(topic, null, 2));
      return res.status(200).send(topic);
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Server error" });
  }
};

const uploadTopicsFromCSV = async (req, res) => {
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

    // Use the static method of Topic model for bulk upload
    const insertedTopics = await Topic.uploadTopicsFromCSV(filePath);
    console.log(`Inserted ${insertedTopics?.length} topics`);
    return res.status(201).send(insertedTopics);
  } catch (error) {
    logger.log("error", `Error processing CSV file: ${error.message}`);
    return res.status(500).send({ message: "Failed to process CSV file" });
  }
};

//add new Topic using mongoose
const addOneTopic = async (req, res) => {
  try {
    const { topicName } = JSON.parse(req?.body?.data);
    if (!topicName) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    //validate authority from middleware authentication
    const auth = req?.auth;
    if (!auth) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //create new Topic object
    let updatedData = { topicName };

    //add new topic
    const result = await Topic.createNewTopic(updatedData);
    if (result === null) {
      logger.log("error", "Failed to add topic!");
      return res.status(500).send({ message: "Failed to add topic!" });
    }
    logger.log("info", `Added a new topic: ${result}`);
    return res.status(201).send(result);
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to add topic!" });
  }
};

// update One topic using mongoose
const updateOneTopic = async (req, res) => {
  try {
    const topicId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

    //object id validation
    if (!ValidObjectId(topicId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }
    let updatedData = { ...data };
    const updatedTopic = await Topic.updateTopicById(topicId, updatedData);

    if (updatedTopic === null) {
      return res.status(404).send({ message: "Topic not found" });
    }
    logger.log("info", `Updated topic: ${updatedTopic}`);
    if (!updatedTopic) {
      return res.status(500).json({ error: "Failed to update topic " });
    }
    return res.json({ success: true, updatedTopic });
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to update topic " });
  }
};

//delete one topic
const deleteOneTopicById = async (req, res) => {
  try {
    const topicId = req?.params?.id;
    //object id validation
    if (!ValidObjectId(topicId)) {
      return res.status(400).send({ message: "Invalid ObjectId" });
    }

    //to perform multiple filters at once
    const filter = {
      _id: topicId,
    };
    //delete topic
    const result = await Topic.deleteOne(filter);
    if (result?.deletedCount === 0) {
      logger.log("error", `No topic found with this id: ${topicId}`);
      return res.status(404).send({ message: "No topic found with this id!" });
    } else {
      logger.log("info", `topic deleted: ${topicId}`);
      return res.status(200).send({
        message: `topic deleted!`,
      });
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return res.status(500).send({ message: "Failed to delete topic!" });
  }
};

module.exports = {
  getAllTopics,
  getOneTopic,
  uploadTopicsFromCSV,
  addOneTopic,
  updateOneTopic,
  deleteOneTopicById,
};
