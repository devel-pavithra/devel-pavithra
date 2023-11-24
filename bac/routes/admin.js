var express = require("express");
var router = express.Router();
const YourDataModel = require("../model/adminModel");

router.get("/", async (req, res, next) => {
  try {
    res.json({ msg: "<h2>TESTING</h2>" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body);
    const termsData = new YourDataModel({
      value: req.body.value,
    });
    const savedData = await termsData.save();
  } catch (error) {
    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
});
router.get("/terms", async (req, res, next) => {
  try {
    await YourDataModel.find({})
      .then((data) => res.json({ data }))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
