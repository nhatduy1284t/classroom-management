import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";

var controller = {};

controller.createAssignment = async (req, res) => {
  try {
    //Check if it's a teacher
    let postAssignment = req.body;

    const assignment = new Assignment({
      ...postAssignment,
      start_date: Date.now(),
      due_date: postAssignment.due_date,
      status: postAssignment.status === "false" ? false : true,
    });

    const result = await assignment.save();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

controller.submitAssignment = async (req, res) => {
  try {
    //Check if it's a student
    let postAssignment = req.body;

    const submission = new Submission(postAssignment);

    const result = await submission.save();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export default controller;
