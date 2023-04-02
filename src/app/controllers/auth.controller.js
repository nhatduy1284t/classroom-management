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

controller.changePassword = async (req, res) => {
  try {
    let { old_password, new_password, confirm_new_password, user_id } =
      req.body;
    let user = await User.findById(user_id).lean();
    let message = "";

    if (user.password !== md5(old_password)) {
      message += encodeURIComponent("Your password is not correct !\n");
    }

    if (new_password !== confirm_new_password) {
      message += encodeURIComponent("Your confirm password is not correct !\n");
    }

    if (new_password.length < 5) {
      message += encodeURIComponent(
        `New password must be at least 5 characters in length !\n`
      );
    }

    if (message !== "") {
      return res.redirect("/home?message=" + message);
    }

    let newPassword = md5(new_password);

    let result = await User.findByIdAndUpdate(user_id, {
      password: newPassword,
    });
    message = "Update password successfully !";

    return res.redirect("/home?message=" + message);
  } catch (error) {
    console.log(error);
  }
};
export default controller;
