const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongoose connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
