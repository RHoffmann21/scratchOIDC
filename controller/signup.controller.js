const AccountService = require('../services/account.service');

module.exports.signupForm = async (req, res, next) => {
    try {
        res.render('signup');
    } catch (error) {
        return next(error);
    }
};

module.exports.signup = async (req, res, next) => {
    // const {username, email, password} = req.body;
    console.log(req);
    // console.log(username, email, password);
    try {
        await AccountService.createAccount(username, email, password);
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        return next(error);
    }
};