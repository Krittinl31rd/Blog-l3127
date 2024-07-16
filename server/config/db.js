const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoose connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
