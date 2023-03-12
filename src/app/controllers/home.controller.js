var homeController = {};

homeController.dashboard = (req, res) => {
  // const users = await User.find();

  const user = req.signedCookies.user_info;
  res.render("index", { user });
};

export default homeController;
