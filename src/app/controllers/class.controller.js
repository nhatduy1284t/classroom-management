import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import User from "../models/User.js";

var classController = {};

classController.createClass = (req, res) => {
  res.render('classes/create')
}

classController.postCreateClass = async (req, res) => {
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

    const classroom = await Class();
    res.render('classes/index', {
      classes: classroom
    });
    
  } catch (error) {
    console.log(error)
  }
};

classController.search = async (req, res) => {
  let q = req.query.q; //Add a search bar w/ method GET and name property 'q' for the input

  const classroom = await Class();
  let matchedClasses = classroom.filter(aClass => aClass.id.toLowerCase().indexOf(q.toLowerCase()) !== -1 || aClass.class_name.toLowerCase().indexOf(q.toLowerCase()) !== -1);

  res.render('classes/index', {
    input: q,
    classes: matchedClasses
  })
}

classController.id = async(req, res) => {
  let id = req.params.id; //Create a btn or link w/ href = `/classes/${class.id}`
  const classroom = await Class();
  let singleClass = classroom.find(aClass => aClass.id == id);
  res.render('classes/single', {
    singleClass: singleClass
  })
}


export default classController;
