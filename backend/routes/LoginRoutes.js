const express = require('express');
const { handleRegisterUser, handleLoginUser, handleVerifyToken, handleAdminLogin , handleAdminRegister} = require('../controllers/LoginController');
const loginRouter = express.Router();


loginRouter.route('/register').post(handleRegisterUser);
loginRouter.route('/login').post(handleLoginUser);
loginRouter.route('/adminlogin').post(handleAdminLogin);
loginRouter.route('/adminregister').post(handleAdminRegister);
loginRouter.route('/verifytoken').post(handleVerifyToken);


module.exports = loginRouter;
