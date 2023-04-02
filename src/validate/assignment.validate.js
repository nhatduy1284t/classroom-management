import fs from 'fs'
import multer from 'multer';


const storage = multer.memoryStorage();
const upload = multer({ storage });
var createAssignValidationStrategy = {
    validate: async (req, res, next) => {
        upload.single("file")(req,res,async function(err) {
   
            var errors = [];
            let content = req.body;
            // console.log("trong validate middleware",req.body)
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
    
            if(req.file) {
                if(req.file.size > 5120000) {
                    errors.push("File too Big (> 5mb), please select a file less than 5mb");
                } 
            }
            
            if(errors.length) {
                
                req.app.locals.errors = errors.join("\n")
                req.app.locals.values = content
                res.redirect(`/class/${content.class_id}`) 
            } 
            else {
                req.bodyTemp = {...req.body};
                req.fileTemp = {...req.file};
                next();
            }
        })


    }
}

export default createAssignValidationStrategy;