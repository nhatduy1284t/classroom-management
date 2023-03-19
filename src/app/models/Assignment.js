import mongoose from "mongoose";
const Schema = mongoose.Schema;

const assignmentSchema = new Schema(
  {
    assignment_id: { type: String },
    assignment_name:{type:String},
    teacher_id: { type: String },
    class_id: { type: String },
    start_date: { type: Date },
    due_date: { type: Date },
    file_url: {type: String},
    description: {type: String}
  },
  { collection: "assignment" }
);

const Assignment = mongoose.model("assignment", assignmentSchema);

export default Assignment;
// module.exports = Assignment;
