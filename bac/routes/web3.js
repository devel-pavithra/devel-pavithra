var express = require("express");
var router = express.Router();
var web3 = require("web3");

router.post("/", async (req, res) => {
  try {
    const newAccount = web3.eth.accounts.create();
    console.log(newAccount);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).json({ message: "action failed", error: error.message });
  }
});

module.exports = router;
