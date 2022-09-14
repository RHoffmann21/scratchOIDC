const Account = require('../models/account.model');

const AccountService = {};

AccountService.createAccount = async (username, email, password) => {

    try {
        const newAccount = new Account({
            username: username,
            email: email,
            password: password
        });

        console.log(newAccount);
        await newAccount.save(function (err) {
            if (err) {
                logger.error('Error while creating account', new Error('Saving account not successful'));
            }
        });
        return newAccount;
    } catch (error) {
        throw Error('Error while saving the new account');
    }
};

AccountService.login = async (formData) => {
    const username = formData.username;
    const password = formData.password;

    try {
        const account = AccountService.getOneAccount(username, password);
        if(!account)return;
        return account;
    } catch (error) {
        throw Error('No account found!');
    }
};

AccountService.getOneAccount = async (username, password) => {
    try {
      const Account = await Account.find({ username: username, password: password });
      return Account;
    } catch (error) {
      throw Error('Error while retrieving account with given credentials.');
    }
  };

module.exports = AccountService;
