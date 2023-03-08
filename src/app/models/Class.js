const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    class_id: { type: String },
    class_name: { type: String },
    start_date: { type: String },
    end_date: { type: Date },
    last_name: { type: Date },
    teacher_id: { type: String },
  },
  { collection: "class" }
);

const Class = mongoose.model("class", classSchema);
module.exports = Class;
