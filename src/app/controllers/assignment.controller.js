import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import Submission from "../models/Submission.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import multer from "multer";
import fs from "fs";
import path, { basename } from "path";
import moment from "moment";

import { promisify } from "util";
const sleep = promisify(setTimeout);

async function blockForOneSecond() {
  await sleep(100);
}

const storage = multer.memoryStorage();
const upload = multer({ storage });
var assignmentController = {};

assignmentController.getAssignment = async (req, res) => {
  try {
    let assignmentId = req.params.assignmentId;
    let assignment = await Assignment.findById(assignmentId).lean();
    let currentDate = new Date();
    let isDueDate = false;

    //For student
    let submission = await Submission.findOne({
      assignment_id: assignmentId,
      student_id: res.locals.user._id,
    }).lean();
 

    //For teacher to see submissions list
    let submissions = await Submission.find({
      assignment_id: assignmentId,
    }).lean();

    let studentEnrollments = await Enrollment.find({
      class_id: assignment.class_id,
    }).lean();

    //Get students who haven't submitted homework yet
    let submittedStudentsId = submissions.map((sub) => sub.student_id);

    let notSubmittedStudentsId = studentEnrollments.map((s) => {
      if (!submittedStudentsId.includes(s.user_id)) {
        return s.user_id;
      }
      return null;
    });

    let notSubmissions = notSubmittedStudentsId.map(async (studentId) => {
      let student = await User.findOne({ _id: studentId }).lean();

      return student;
    });
    notSubmissions = await Promise.all(notSubmissions);
    notSubmissions = notSubmissions.filter(
      (student) => student !== null && student.user_type == "0"
    );

    console.log(submissions);
    if (currentDate >= assignment.due_date) {
      isDueDate = true;
      let isAdded = false;
      notSubmissions.forEach(async (student) => {
        let studentId = student._id.toString();
        let emptySubmission = await Submission.findOne({
          student_id: studentId,
          assignment_id: assignmentId,
        });

        if (emptySubmission) {
        } else {
          console.log("empty submission created");
          let eSubmission = Submission({
            assignment_id: assignmentId,
            student_id: studentId,
            grade: 0,
          });

          let result = await eSubmission.save();
          console.log("empty submission created 2");
        }
      });
      notSubmissions = []
    }
    //Get students who already submitted homework
    await blockForOneSecond();
    submissions = await Submission.find({
      assignment_id: assignmentId,
    }).lean();

    submissions = submissions.map(async (s) => {
      let student = await User.findById(s.student_id).lean();
      console.log("student ne", student);
      return {
        ...s,
        _id: s._id.toString(),
        username: student.username,
        first_name: student.first_name,
        last_name: student.last_name,
      };
    });
    submissions = await Promise.all(submissions);
    console.log("submissions ne", submissions);
    assignment.start_date = moment(assignment.start_date).format(
      "dddd, D MMMM YYYY, h:mm A"
    );
    assignment.due_date = moment(assignment.due_date).format(
      "dddd, D MMMM YYYY, h:mm A"
    );

    if (submission && submission.file_url) {
      submission.file_name = path.basename(submission.file_url);
    }

    res.render("assignment/detail", {
      assignment,
      submissions,
      submission,
      notSubmissions,
      isDueDate,
      dueDateMessage: req.query.dueDateMessage,
      message: req.query.message,
      errors: req.app.locals.errors,
    });
    req.app.locals.errors = [];
    req.app.locals.values = "";
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

assignmentController.createAssignment = async (req, res) => {
  try {
    // Pass the request object to the multer instance to get access to the file object
    upload.single("file")(req, res, async function (err) {
      req.body = req.bodyTemp;
      req.file = req.fileTemp;

      let classId = req.body.class_id;
      let postAssignment = req.body;

      //Basic information of assignment
      const assignment = new Assignment({
        ...postAssignment,
        start_date: Date.now(),
        due_date: postAssignment.assignment_due_date,
        teacher_id: res.locals.user._id.toString(),
      });

      // Access the uploaded file information from the 'req.file' object
      const file = req.file;
      console.log(file);

      if (Object.keys(file).length > 0) {
        // Store in public to send to client
        let folderPath = `src/public/views/assets/assignment/${assignment._id.toString()}`;
        if (!fs.existsSync(folderPath)) {
          fs.mkdir(folderPath, function (err) {
            if (err) {
              console.error("Failed to create folder:", err);
            } else {
              console.log("Folder created:", folderPath);
            }
          });
        }
        fs.writeFile(
          `${folderPath}/${file.originalname}`,
          file.buffer,
          { encoding: "utf-8" },
          function (err) {
            if (err) {
              console.log("err");
              return res.status(500).send("Error writing file to disk");
            }
          }
        );
        assignment.file_url = `/assignment/${assignment._id.toString()}/${
          file.originalname
        }`;
      }
      const result = await assignment.save();
      return res.redirect(`/class/${classId}`);
    });
  } catch (error) {
    console.log("error create assignment", error);
    res.send(error);
  }
};

assignmentController.submitAssignment = async (req, res) => {
  try {
    upload.single("file")(req, res, async function (err) {
      console.log("vao day", req.file);
      //start validate
      var errors = [];
      let currentDate = new Date();
      let assignment = await Assignment.findById(req.body.assignment_id).lean();

      if (currentDate >= assignment.due_date) {
        let dueDateMessage = encodeURIComponent(
          "You cannot submit after due date !"
        );
        return res.redirect(
          `/assignment/${req.body.assignment_id}?dueDateMessage=${dueDateMessage}`
        );
      }

      const file = req.file;

      if (Object.keys(file).length > 0) {
        if (req.file.size > 5120000) {
          errors.push(
            "File too Big (> 5mb), please select a file less than 5mb"
          );
        }
      }

      if (errors.length) {
        let message = encodeURIComponent(
          "File too Big (> 5mb), please select a file less than 5mb"
        );
        return res.redirect(
          `/assignment/${req.body.assignment_id}?message=${message}`
        );
      }

      let postSubmission = req.body;
      const submission = new Submission({ ...postSubmission });

      if (Object.keys(file).length > 0) {
        // Store file at backend
        let folderPath = `src/public/views/assets/submission/${submission._id.toString()}`;
        if (!fs.existsSync(folderPath)) {
          fs.mkdir(folderPath, function (err) {
            if (err) {
              console.error("Failed to create folder:", err);
            } else {
              console.log("Folder created:", folderPath);
            }
          });
        }
        fs.writeFile(
          `${folderPath}/${file.originalname}`,
          file.buffer,
          { encoding: "utf-8" },
          function (err) {
            if (err) {
              console.log("err");
              return res.status(500).send("Error writing file to disk");
            }
          }
        );
        submission.file_url = `/submission/${submission._id.toString()}/${
          file.originalname
        }`;
        const result = await submission.save();
        res.redirect(`/assignment/${req.body.assignment_id}`);
      }
    });
  } catch (error) {
    // console.log(error);
    res.send("ahaha");
  }
};

assignmentController.changeSubmitAssignment = async (req, res) => {
  try {
    upload.single("file")(req, res, async function (err) {
      if (err) {
        return res.status(400).send("Error uploading file");
      }
      let currentDate = new Date();
      let assignment = await Assignment.findById(req.body.assignment_id).lean();

      if (currentDate >= assignment.due_date) {
        let dueDateMessage = encodeURIComponent(
          "You cannot submit after due date !"
        );
        return res.redirect(
          `/assignment/${req.body.assignment_id}?dueDateMessage=${dueDateMessage}`
        );
      }
      let errors = [];
      const file = req.file;
      if (Object.keys(file).length > 0) {
        if (req.file.size > 5120000) {
          errors.push(
            "File too Big (> 5mb), please select a file less than 5mb"
          );
        }
      }

      if (errors.length) {
        let message = encodeURIComponent(
          "File too Big (> 5mb), please select a file less than 5mb"
        );
        return res.redirect(
          `/assignment/${req.body.assignment_id}?message=${message}`
        );
      }

      let postSubmission = req.body;
      const submission = await Submission.findOne({
        assignment_id: postSubmission.assignment_id,
        student_id: postSubmission.student_id,
      }).lean();

      const oldFileUrl = submission.file_url;
      //Delete old file
      fs.unlink(`src/public/views/assets${oldFileUrl}`, (err) => {
        if (err) throw err;
      });

      //Write new file
      if (Object.keys(file).length > 0) {
        // Store file at backend
        let folderPath = `src/public/views/assets/submission/${submission._id.toString()}`;
        fs.writeFile(
          `${folderPath}/${file.originalname}`,
          file.buffer,
          { encoding: "utf-8" },
          function (err) {
            if (err) {
              console.log("err");
              return res.status(500).send("Error writing file to disk");
            }
          }
        );

        //update file_url in database
        let result = await Submission.findOneAndUpdate(
          {
            assignment_id: req.body.assignment_id,
            student_id: req.body.student_id,
          },
          {
            file_url: `/submission/${submission._id.toString()}/${
              file.originalname
            }`,
          }
        );
        res.redirect(`/assignment/${req.body.assignment_id}`);
      }
    });
    // res.send("asd");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

assignmentController.grade = async (req, res) => {
  try {
    let { grade, submission_id, assignment_id } = req.body;

    let result = await Submission.findByIdAndUpdate(submission_id, {
      grade: grade,
    });
    res.redirect(`/assignment/${assignment_id}`);
    res.json(req.body);
  } catch (error) {}
};
export default assignmentController;
