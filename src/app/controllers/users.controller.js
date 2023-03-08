import User from '../models/User.js'

var controller = {};



controller.index = async (req, res) => {
    const users = await User.find();
    res.render('users/index', {
        users: users
    });
};

controller.signup = (req, res) => {
    res.render('users/signup');
};

controller.create = async (req, res) => {
    let user = req.body
    let user_type = 2


    if(user.type == "teacher"){
        user_type = 1
    }


    let date = new Date()

    try {
        const men = new User({ 
            username: user.username, 
            password: user.password, 
            first_name: user.first_name, 
            last_name: user.last_name, 
            type: user_type, 
            joined_date: date.getYear() + '-' + date.getMonth() + '-' + date.getDate()
        });
        const status = await men.save();
        res.redirect('/users'); 
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

};


// controller.search = (req, res) => {
//     let q = req.query.q;
//     db.read();
//     let matchedUsers = db.data.users.filter(user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);

//     res.render('users/index', {
//         input: q,
//         users: matchedUsers
//     })
// };



// controller.id = (req, res) => {
//     var id = req.params.id;
//     db.read();
//     var user = db.data.users.find(user => user.id == id);
//     res.render('users/view', {
//         user: user
//     })
// };

// controller.postCreate = (req, res) => {
//     req.body.id = shortid.generate();
//     req.body.avatar = req.file.path.split("/").splice(1).join("/");

//     db.data.users.push(req.body);
//     db.write();

//     res.redirect('/users'); 
// };

export default controller; 
