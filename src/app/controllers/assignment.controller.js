import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import multer from "multer";
import fs from "fs";
import path, { basename } from "path";
import moment from "moment";

const storage = multer.memoryStorage();
const upload = multer({ storage });
var assignmentController = {};

assignmentController.getAssignment = async (req, res) => {
  try {
    let assignmentId = req.params.assignmentId;
    let assignment = await Assignment.findById(assignmentId).lean();

    let submission = []
    if(req.signedCookies.user_info.user_type == 0) {
      submission = await Submission.findOne({
        assignment_id: assignmentId,
        student_id: res.locals.user._id,
      }).lean();
      if (submission) {
        submission.file_name = path.basename(submission.file_url);
      }
    } else {
      submission = await Submission.find({assignment_id: assignmentId})
      if(submission) {
        let users = await User.find()
        console.log(users)
        submission.forEach(sub => {
          users.forEach(user => {
            if(sub.student_id == user._id.toString()) {
              sub.owner_name = user.username
            }
          })
        })
      }
    }

    assignment.start_date = moment(assignment.start_date).format(
      "dddd, D MMMM YYYY, h:mm A"
    );
    assignment.due_date = moment(assignment.due_date).format(
      "dddd, D MMMM YYYY, h:mm A"
    );
  
    console.log(submission)
    res.render("assignment/detail", { assignment, submission });
  } catch (error) {
    console.log(error)
  }
};

assignmentController.createAssignment = async (req, res) => {
  try {
    // Pass the request object to the multer instance to get access to the file object
    upload.single("file")(req, res, async function (err) {
      if (err) {
        return res.status(400).send("Error uploading file");
      }
      let classId = req.body.class_id;
      let postAssignment = req.body;

      //Basic information of assignment
      const assignment = new Assignment({
        ...postAssignment,
        start_date: Date.now(),
        due_date: postAssignment.assignment_due_date,
        teacher_id: res.locals.user._id.toString(),
      });
      console.log(assignment);
      // Access the uploaded file information from the 'req.file' object
      const file = req.file;

      if (file) {
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
      // Do any necessary validations with the file
      // if (!file) {
      //   return res.status(400).send('No file uploaded!');
      // }
      // if (file.size > 1024 * 1024 * 5) {
      //   return res.status(400).send('File size should be less than 5MB!');
      // }
      // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      //   return res.status(400).send('Only image files are allowed!');
      // }
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

assignmentController.submitAssignment = async (req, res) => {
  try {
    upload.single("file")(req, res, async function (err) {
      console.log(req.body);
      if (err) {
        return res.status(400).send("Error uploading file");
      }
      let postSubmission = req.body;
      const submission = new Submission({ ...postSubmission });
      const file = req.file;
      if (file) {
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
    console.log(error);
    res.send(error);
  }
};

assignmentController.changeSubmitAssignment = async (req, res) => {
  try {
    upload.single("file")(req, res, async function (err) {
      if (err) {
        return res.status(400).send("Error uploading file");
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
        console.log('File deleted!');
      });
      const file = req.file;
      //Write new file
      if (file) {
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

export default assignmentController;
