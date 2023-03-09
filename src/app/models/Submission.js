// const mongoose = require("mongoose");
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    submission_id: { type: String },
    student_id: { type: String },
    assignment_id: { type: String },
    file_url: { type: String },
  },
  { collection: "submission" }
);

const Submission = mongoose.model("submission", submissionSchema);
// module.exports = Submission;
export default Submission;
