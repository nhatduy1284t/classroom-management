import mongoose from "mongoose";
import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

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

classController.search = async (req, res) => {
  let q = req.query.q; //Add a search bar w/ method GET and name property 'q' for the input

  const classroom = await Class();
  let matchedClasses = classroom.filter(
    (aClass) =>
      aClass.id.toLowerCase().indexOf(q.toLowerCase()) !== -1 ||
      aClass.class_name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  );

  res.render("classes/index", {
    input: q,
    classes: matchedClasses,
  });
};

classController.getClass = async (req, res) => {
  try {
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
    console.log(classId, userId);
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
