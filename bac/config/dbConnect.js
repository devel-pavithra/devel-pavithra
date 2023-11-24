const mongoose = require("mongoose");

const dbURL = "mongodb://localhost:27017/NFT_Task";


mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database.");
});
