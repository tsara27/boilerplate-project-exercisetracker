require('dotenv').config();

const mongoose = require("mongoose");
const { Schema } =  mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const exerciseSchema = new Schema({
  user: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: false }
});

module.exports.Exercise = mongoose.model('Exercise', exerciseSchema);
