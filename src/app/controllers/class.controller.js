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
    res.json(result);
  } catch (error) {
    console.log(error)
  }
};

classController.getClasses = async (req, res) => {
  try {
    //Check if it's an admin
    
    //then create
    let postClass = req.body;

    const classroom = new Class(postClass);

    const result = await classroom.save();
    res.json(result);
  } catch (error) {
    console.log(error)
  }
};



export default classController;
