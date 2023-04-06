import mongoose from "mongoose";
import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import moment from "moment";
import { promisify } from "util";
var classController = {};

classController.createClass = (req, res) => {
  res.render("classes/create");
};

classController.postCreateClass = async (req, res) => {
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
    console.log("da vao day getClasses");
    //admin: show all classrooms
    //student, teacher: only enrolled classes
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

    if (res.locals.user.user_type !== "2") {
      let userId = res.locals.user._id.toString();
      let enrollments = await Enrollment.find({ user_id: userId });
      let enrollmentsClassId = enrollments.map((e) => e.class_id);
      classes = classes.filter((c) =>
        enrollmentsClassId.includes(c._id.toString())
      );
    }

    res.render("classes/classes", { classes: classes });
  } catch (error) {
    console.log(error);
  }
};

classController.search = async (req, res) => {
  let q = req.query.q; //Add a search bar w/ method GET and name property 'q' for the input

  const classroom = await Class();
  let matchedClasses = classroom.filter(
    (aClass) => aClass.class_name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  );

  res.render("classes/classes", {
    input: q,
    classes: matchedClasses,
  });
};

classController.getClassStudent = async (req, res) => {
  let classId = req.params.id;
  let assignments = await Assignment.find({ class_id: classId }).lean(); //teachers
  let enrollments = await Enrollment.find({ class_id: classId }).lean();
  let classroom = await Class.findById(classId).lean();

  let avgGrade = 0;
  let numOfGrade = 0;

  let users = enrollments.map(async (e) => {
    let userInfo = await User.findById(e.user_id).lean();

    return userInfo;
  });
  users = await Promise.all(users);

  assignments.forEach(async (a) => {
    let submission = await Submission.findOne({
      student_id: res.locals.user._id,
      assignment_id: a._id.toString(),
    }).lean();

    a.due_date = moment(a.due_date).format("dddd, D MMMM YYYY, h:mm A");

    if (submission && submission.file_url) {
      a.submitted = true;
      console.log(submission.grade)

    } else {
      a.submitted = false;
    }

    if (submission && submission.grade !== undefined) {
      avgGrade += submission.grade;
      numOfGrade += 1;
      console.log("vao")
    }
  });
  await promisify(setTimeout)(50);

  console.log(avgGrade/numOfGrade);
  assignments = await Promise.all(assignments);

  let students = users.filter((user) => user.user_type == "0");
  let teachers = users.filter((user) => user.user_type == "1");

  res.render("classes/detail", {
    classroom,
    class_id: classId,
    assignments: assignments,
    students,
    teachers,
    avgGrade:avgGrade/numOfGrade
  });
};

classController.getClassTeacher = async (req, res) => {
  try {
    let classId = req.params.id;
    let assignments = await Assignment.find({ class_id: classId }).lean(); //teachers
    let enrollments = await Enrollment.find({ class_id: classId }).lean();
    let classroom = await Class.findById(classId).lean();

    let users = enrollments.map(async (e) => {
      let userInfo = await User.findById(e.user_id).lean();

      return userInfo;
    });
    users = await Promise.all(users);

    assignments = assignments.map(async (a) => {
      let submissions = await Submission.find({
        assignment_id: a._id.toString(),
      }).lean();

      a.numOfSubmitted = submissions.filter((s) => s.file_url).length;
      a.due_date = moment(a.due_date).format("dddd, D MMMM YYYY, h:mm A");

      return a;
    });

    assignments = await Promise.all(assignments);
    
    let students = users.filter((user) => user.user_type == "0");
    let teachers = users.filter((user) => user.user_type == "1");

    res.render("classes/detail", {
      class_id: classId,
      classroom,
      assignments: assignments,
      students,
      teachers,
      errors: req.app.locals.errors,
      values: req.app.locals.values,
    });
    req.app.locals.errors = [];
    req.app.locals.values = "";
  } catch (error) {
    console.log(error);
  }
};

classController.getClass = async (req, res) => {
  try {
    if (res.locals.user.user_type == "0") {
      //student
      classController.getClassStudent(req, res);
      return;
    }
    if (res.locals.user.user_type == "1") {
      //class
      classController.getClassTeacher(req, res);
      return;
    }
    //Check if it's an admin
    //then create
    let classId = req.params.id;
    let students = await User.find({ user_type: 0 }).lean(); //students
    let teachers = await User.find({ user_type: 1 }).lean(); //teachers
    let classroom = await Class.findById(classId).lean();

    let enrollments = await Enrollment.find({ class_id: classId });
    let enrollmentsUserId = enrollments.map((enrollment) => enrollment.user_id);

    let notInClassTeachers = teachers.filter(
      (teacher) => !enrollmentsUserId.includes(teacher._id.toString())
    );
    let notInClassStudents = students.filter(
      (student) => !enrollmentsUserId.includes(student._id.toString())
    );
    let inClassTeachers = [];
    let inClassStudents = [];

    teachers.forEach((teacher) => {
      enrollments.forEach((enroll) => {
        if (enroll.user_id === teacher._id.toString()) {
          teacher = {
            ...teacher,
            class_id: classId,
            enroll_date: new Date(enroll.enroll_date).toLocaleDateString(
              "en-GB"
            ),
          };
          inClassTeachers.push(teacher);
        }
      });
    });
    students.forEach((student) => {
      enrollments.forEach((enroll) => {
        if (enroll.user_id === student._id.toString()) {
          student = {
            ...student,
            class_id: classId,
            enroll_date: new Date(enroll.enroll_date).toLocaleDateString(
              "en-GB"
            ),
          };
          inClassStudents.push(student);
        }
      });
    });

    classroom._id = classId;

    res.render("classes/assign-class", {
      classroom,
      students: {
        inClassStudents,
        notInClassStudents,
      },
      teachers: {
        inClassTeachers,
        notInClassTeachers,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

classController.assignClass = async (req, res) => {
  try {
    //Check if it's an admin

    //then create
    let classId = req.params.id;
    let usersId = req.body.users;

    //teacher enrollment
    let enrollments = usersId.map((userId) => {
      return {
        enroll_date: Date.now(),
        status: true,
        user_id: userId,
        class_id: classId,
      };
    });
    let result = await Enrollment.create(enrollments);
    res.redirect(`/class/${classId}`);
  } catch (error) {
    console.log(error);
  }
};

classController.unassignClass = async (req, res) => {
  try {
    let classId = req.params.id;
    let userId = req.params.userId;

    let result = await Enrollment.findOneAndDelete({
      user_id: userId,
      class_id: classId,
    });

    res.redirect(`/class/${classId}`);
  } catch (error) {
    console.log(error);
  }
};

export default classController;
