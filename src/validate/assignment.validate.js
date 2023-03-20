import fs from 'fs'

var createAssignValidationStrategy = {
    validate: async (req, res, next) => {

        var errors = [];
        let content = req.body;

        if(!content.assignment_name) {
            errors.push("Assignment name is required!");
        }

        if(!content.assignment_due_date) {
            errors.push("Due date is required");
        } else if(content.assignment_due_date && new Date(content.assignment_due_date) <= new Date()) {
            errors.push("Due date must be later than the current date");
        }

        if(!content.description) {
            errors.push("Instruction is required");
        }

        console.log(content.file_size)
        if(content.file) {
            if(content.file_size > 512000) {
                errors.push("File too Big (> 5mb), please select a file less than 5mb");
            } 
        }

        if(errors.length) {
            req.app.locals.errors = errors.join("\n")
            req.app.locals.values = content
            res.redirect(`/class/${content.class_id}`) 
        } else {
            next();
        }
    }
}

export default createAssignValidationStrategy;