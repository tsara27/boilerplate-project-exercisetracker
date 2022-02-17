require('dotenv').config();

const mongoose = require("mongoose");
const { Schema } =  mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const userSchema = new Schema({
  username: { type: String, required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }]

});

module.exports.User = mongoose.model('User', userSchema);
