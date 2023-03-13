let privilege = (req, res, next) => {
    if(req.signedCookies.user_info.user_type != 2) {
        errors = []
        errors.push("User type is not admin")
        res.render("_404", {errors})
    }

    next()
}

export default privilege