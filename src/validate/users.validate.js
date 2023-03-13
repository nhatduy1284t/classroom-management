var postCreate = (req, res, next) => {
    var errors = [];
    let user = req.body;

    if(!user.username) {
        errors.push("Username is required!");
    }
    if(!user.password) {
        errors.push("Password is required");
    }

    if(user.password != user.confirm_password) {
        errors.push("Password and confirmed password not match");
    }


    if(!user.first_name) {
        errors.push("First name is required");
    }

    if(!user.last_name) {
        errors.push("Last name is required");
    }

    if(errors.length) {
        res.render('users/signup', {
            errors: errors.join("\n"),
            values: user
        })
        return;
    } 

    res.locals.success = true;

    next();
}

export default postCreate;