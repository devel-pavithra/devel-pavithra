const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("image");

router.get("/", async (req, res) => {
  try {
    // const users = await User.find({});
    // res.json({ data: users });
    res.send({msg:"okok"})
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

router.post("/", async (req, res) => {

 console.log(req.body);
    try {
      const {  UserName, email, password } = req.body;
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        UserName,
        email,
        password: encryptedPassword,
      
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(400).json({ message: "Registration failed", error: error.message });
    }
 
});

router.get("/fetchuser/:id", async (req, res) => {
  // const token = req.headers.authorization;

  // if (!token || !token.startsWith("Bearer ")) {
  //   return res.status(401).json({ message: "Token unavailable" });
  // }

  // const tokenVal = token.split(" ")[1];

  try {
    // const decoded = jwt.verify(tokenVal, "your-secret-key");
    // const userID = decoded._id;

    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/getuser", async (req, res) => {
  
  const token = req.headers.authorization;
  console.log(token);
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token unavailable" });
  }

  const tokenVal = token.split(" ")[1];

  try {
    const decoded = jwt.verify(tokenVal, "dsjdhfuhuoh");
    const userID = decoded._id;

    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.put("/edituser/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    const { firstName, lastName, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      ID,
      { firstName, lastName, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "User update failed", error: error.message });
  }
});

router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    const result = await User.deleteOne({ _id: ID });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});



module.exports = router;
