// Import required modules and dependencies
var express = require("express");
var router = express.Router();
var multer = require("multer");
const Image = require('../models/imageModel');
const fs = require("fs");
const path = require("path");

// Configure the storage for multer
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + "-"  + file.originalname);
  },
});

var upload = multer({ storage: storage });

// Define your routes
router.get("/", function (req, res, next) {
  try {
    Image.find({})
      .then((data) => console.log(data))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log(error);
  }
});

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    // Create an object to store in the database
    var obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: path.join(__dirname, "uploads", req.file.filename)
    };

    // Save the object in your database using promises
    const item = await Image.create(obj);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while saving image to the database.");
  }
});

module.exports = router;
