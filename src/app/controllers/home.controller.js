var homeController = {};

homeController.dashboard = (req, res) => {
  const user = res.locals.user;

  let message = req.query.message;

  res.render("index", { user: user, message: message });
};

export default homeController;
