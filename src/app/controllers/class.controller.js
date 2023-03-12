import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import User from "../models/User.js";

var classController = {};

classController.createClass = async (req, res) => {
  try {
    //Check if it's an admin

    //then create
    let postClass = req.body;
    // postClass.teacher_id = [];
    const classroom = new Class(postClass);
    const result = await classroom.save();
    res.redirect("/class");
  } catch (error) {
    console.log(error);
  }
};

classController.getClasses = async (req, res) => {
  try {
    //Check if it's an admin

    //then create
    let classes = await Class.find();

    classes = classes.map((model) => {
      model._doc.start_date = new Date(
        model._doc.start_date
      ).toLocaleDateString("en-GB");
      model._doc.end_date = new Date(model._doc.end_date).toLocaleDateString(
        "en-GB"
      );
      return model._doc;
    });
    console.log(classes);
    res.render("classes/classes", { classes: classes });
  } catch (error) {
    console.log(error);
  }
};

classController.getClass = async (req, res) => {
  try {
    //Check if it's an admin

    //then create
    let classId = req.params.id;
    let students = await User.find({ user_type: 0 }).lean(); //students
    let teachers = await User.find({ user_type: 1 }).lean(); //teachers
    let classroom = await Class.findById(classId).lean();
    res.render("classes/assign-class", { classroom, students, teachers });
  } catch (error) {
    console.log(error);
  }
};

classController.assignClass = async (req, res) => {
  try {
    //Check if it's an admin

    //then create
    let classId = req.params.id;
    let teachersId = req.body.teachers;

    let classroom = await Class.findByIdAndUpdate(classId, {
      $addToSet: { teacher_id: teachersId },
    });
    // console.log(classroom);

    res.send("classes/assign-class");
  } catch (error) {
    console.log(error);
  }
};

export default classController;
