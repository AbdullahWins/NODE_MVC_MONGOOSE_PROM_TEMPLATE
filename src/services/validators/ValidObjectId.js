const mongoose = require("mongoose");
const { logger } = require("../loggers/Winston");

const validObjectId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    logger.log("error", `Invalid ObjectId: ${userId}`);
    return false;
  } else {
    return true;
  }
};

module.exports = { validObjectId };
