import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    class_id: { type: String },
    class_name: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    teacher_id: { type: String },
  },
  { collection: "class" }
);

const Class = mongoose.model("class", classSchema);

export default Class;
