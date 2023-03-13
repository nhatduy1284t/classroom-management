var postCreate = (req, res, next) => {
    var errors = [];
    let theClass = req.body;

    if(!theClass.id) {
        errors.push("Id is required!");
    }
    if(!theClass.name) {
        errors.push("Name is required");
    }

    if(!theClass.start_date) {
        errors.push("Start date is required");
    }

    if(!theClass.end_date) {
        errors.push("End date is required");
    }

    if(!theClass.teacher_id) {
        errors.push("Teacher is required");
    }

    if(errors.length) {
        res.render('classes/create', {
            errors: errors,
            values: theClass
        })
        return;
    } 

    res.locals.success = true;

    next();
}

export default postCreate;