const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    user_id: { type: String },
    username: { type: String },
    password: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    type: { type: String },
    joined_date: { type: Date },
  },
  { collection: "user" }
);

const User = mongoose.model("user", userSchema);

User.createUser = (user) => {
  
}
module.exports = User;

/*
  Example of use in other file
  const testUser = require("./app/models/User");
  const result = await testUser.find({});
  console.log(result); // 'hello'
*/
