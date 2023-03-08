const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema(
  {
    assignment_id: { type: String },
    status: { type: Boolean },
    user_id: { type: String },
    class_id: { type: String },
    start_date: { type: Date },
    due_date: { type: Date },
  },
  { collection: "assignment" }
);

const Assignment = mongoose.model("assignment", assignmentSchema);
module.exports = Assignment;
