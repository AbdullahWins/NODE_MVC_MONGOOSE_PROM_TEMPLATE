const multer = require("multer");
const path = require("path");
const fs = require("fs");

const initializeMulter = (app) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  // For handling a single file
  //   app.use(upload.single("file"));

  // For handling multiple files (e.g., with input field name "files")
  app.use(upload.array("files", 10));

  // Handle any field name for file uploads
  //   app.use(upload.any());

  // If you want to limit the number of files and their size, you can use the following:
  // app.use(upload.array("files", 10)); // 10 is the maximum number of files allowed

  // If you want to handle mixed types of fields (single and multiple files), you can use:
  // app.use(upload.fields([{ name: "singleFile", maxCount: 1 }, { name: "multipleFiles", maxCount: 10 }]));
};

module.exports = { initializeMulter };
