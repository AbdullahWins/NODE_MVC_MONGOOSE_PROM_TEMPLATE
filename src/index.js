//imports
const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

//module imports
const routes = require("./routes/main/mainRouter.js");
const { initializeCors } = require("../config/cors/cors.config.js");
const { initializeServer } = require("../config/server/server.config.js");
const { initializeMulter } = require("../config/multer/multer.config.js");
const {
  initializePassport,
} = require("../config/authentications/passport.config.js");
const {
  requestDurationMiddleware,
} = require("../config/monitorings/prometheus.config.js");
const StudentEvaluation = require("./models/StudentEvaluationModel.js");

//middlewares
app.use(express.urlencoded({ extended: true }));

// Add Prometheus middleware to collect request duration
app.use(requestDurationMiddleware);

//cors
initializeCors(app);

//multer
initializeMulter(app);

//passport
initializePassport(app);

//routes
app.use(routes);

//start the server
initializeServer(app);
