import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import User from "../models/User.js";

var classController = {};

classController.createClass = async (req, res) => {
  try {
    //Check if it's an admin

    //then create
    let postClass = req.body;
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
      model._doc.start_date = (new Date(model._doc.start_date)).toLocaleDateString('en-GB')
      model._doc.end_date = (new Date(model._doc.end_date)).toLocaleDateString('en-GB')
      return model._doc
    })

    res.render("classes/classes", { classes: classes });
  } catch (error) {
    console.log(error);
  }
};

export default classController;
