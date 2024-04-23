const { logger } = require("../../src/services/loggers/Winston");
const connectToDatabase = require("../databases/mongoose.config");
const port = process.env.SERVER_PORT || 5000;

//starting the server
async function initializeServer(app) {
  try {
    // Connect to MongoDB using Mongoose
    await connectToDatabase();

    // Start the server
    app.listen(port, () => {
      logger.log("info", `Server is running on port: ${port}`);
    });
  } catch (error) {
    // Log the error and exit the process
    logger.log("error", "Error starting the server: ", error);
    process.exit(1);
  }
}

module.exports = { initializeServer };
