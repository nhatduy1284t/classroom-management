import User from "../app/models/User.js";

var requireAuth = async (req, res, next) => {
    if(!req.signedCookies.user_info) {
        res.redirect("/");
        return;
    }

    const users = await User.find();
    var user = users.find(user => user.id == req.signedCookies.user_info.user_id);
    
    if(!user) {
        res.redirect("/");
        return;
    }

    res.locals.user = user._doc;
    next();
};

export default requireAuth;