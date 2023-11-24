var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
var jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@mail.com" && password === "234") {
      const adminToken = jwt.sign({ role: "admin" }, "dsjdhfuhuoh", {
        expiresIn: "1h",
      });
      return res
        .status(201)
        .json({ token: adminToken, message: "Admin success" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userToken = jwt.sign({ _id: user._id, role: "user" }, "dsjdhfuhuoh", {
      expiresIn: "1h",
    });

    res.status(200).json({ token: userToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
