let privilege = (req, res, next) => {
    if(req.signedCookies.user_info.user_type != 2) {
        let errors = []
        errors.push("User type is not admin")
        res.render("_404", {errors})
        return;
    }

    next()
}

export default privilege