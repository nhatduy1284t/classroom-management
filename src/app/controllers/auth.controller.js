import User from '../models/User.js'

var controller = {};

controller.login = (req, res) => {
    // const users = await User.find();
    res.render('auth/signin')
};

controller.postLogin = async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    const users = await User.find()
    var user = users.find(user => user.username == username);
    
    if(!user) {
        res.render('auth/signin', {
            errors: [
                'User does not exist'
            ],
            values: req.body
        })
        return;
    }

    var hashedPassword = md5(password);

    if(user.password !== hashedPassword) {
        res.render('auth/login', {
            errors: [
                'Wrong password.'
            ],
            values: req.body
        })
        return;
    }

    res.cookie('userId', user.id, {
        signed: true
    });
    res.redirect('/users');
};


export default controller; 
