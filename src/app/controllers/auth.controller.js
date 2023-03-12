import User from "../models/User.js";
import md5 from "md5";
var controller = {};

controller.login = (req, res) => {
  // const users = await User.find();
  res.render("auth/signin");
};

controller.logout = (req, res) => {
  // const users = await User.find();
  res.clearCookie("user_info");
  res.redirect("/");
};

controller.postLogin = async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  const users = await User.find();
  var user = users.find((user) => user.username == username);
  if (!user) {
    console.log("user doesn't exist");
    res.render("auth/login", {
      layout: "login",
      errors: ["User does not exist"],
      values: req.body,
    });
    res.render("auth/login", { layout: "login" });
    return;
  }

  var hashedPassword = md5(password);

  if (user.password !== hashedPassword) {
    console.log("wrong pass");
    res.render("auth/login", {
      layout: "login",
      errors: ["Wrong password."],
      values: req.body,
    });
    return;
  }

  res.cookie(
    "user_info",
    {
      user_id: user.id,
      user_type: user._doc.user_type,
      username: user._doc.username,
    },
    {
      signed: true,
    }
  );
  // let user2 = { username: user.username, password: user.password };
  // let user2 = user._doc
  // console.log(user2)
  // res.render("index", { user: user._doc });

  res.redirect("/home");
};

export default controller;
