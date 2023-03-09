import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    type: { type: Number, required: true },
    joined_date: { type: Date, required: true },
  },
  
);

const User = mongoose.model("user", userSchema);

export default User;
