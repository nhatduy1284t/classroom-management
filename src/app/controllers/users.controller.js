import md5 from "md5";
import User from "../models/User.js";
import moment from "moment";
var controller = {};

controller.index = async (req, res) => {
  const users = await User.find();

  res.render("users/index", {
    users: users,
  });
};

controller.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    users.forEach((user) => {
      user.joined_date = moment(user.joined_date).format("DD-MM-YYYY");
    });
    console.log(users);
    return res.render("users/users", {
      users: users,
    });
  } catch (error) {
    console.log(error);
  }
};

controller.getCreateUser = (req, res) => {
  console.log("trong create user", res.locals.user);
  res.render("users/signup");
};

controller.signup = (req, res) => {
  res.render("users/signup");
};

controller.createUser = async (req, res) => {
  console.log("ASd");
  let user = req.body;
  let date = new Date();
  try {
    const men = new User({
      username: user.username,
      password: md5(user.password),
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      joined_date:
        date.getYear() + "-" + date.getMonth() + "-" + date.getDate(),
    });
    const status = await men.save();
    res.render("users/signup", { usernameCreated: men.username });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

controller.changeInfo = async (req, res) => {
  let { user_id, first_name, last_name } = req.body;

  try {
    let result = await User.findByIdAndUpdate(user_id, {
      first_name,
      last_name,
    });
    return res.redirect('/users');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

controller.delete = async (req, res) => {
  let { user_id } = req.body;

  try {
    let result = await User.findByIdAndDelete(user_id);
    return res.redirect('/users');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// controller.search = (req, res) => {
//     let q = req.query.q;
//     db.read();
//     let matchedUsers = db.data.users.filter(user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);

//     res.render('users/index', {
//         input: q,
//         users: matchedUsers
//     })
// };

// controller.id = (req, res) => {
//     var id = req.params.id;
//     db.read();
//     var user = db.data.users.find(user => user.id == id);
//     res.render('users/view', {
//         user: user
//     })
// };

// controller.postCreate = (req, res) => {
//     req.body.id = shortid.generate();
//     req.body.avatar = req.file.path.split("/").splice(1).join("/");

//     db.data.users.push(req.body);
//     db.write();

//     res.redirect('/users');
// };

export default controller;
