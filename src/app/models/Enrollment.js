import mongoose from "mongoose"

const Schema = mongoose.Schema;

const enrollmentSchema = new Schema(
  {
    enroll_id: { type: String },
    enroll_date: { type: Date },
    status: { type: Boolean },
    user_id: { type: String },
    class_id: { type: String },
  },
  { collection: "enrollment" }
);

const Enrollment = mongoose.model("enrollment", enrollmentSchema);
export default Enrollment;

