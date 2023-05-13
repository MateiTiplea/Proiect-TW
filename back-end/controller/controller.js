const {authController} = require("./authController");
const AppError = require("../utils/appError");
const errorController = require("./errorController");
const {userController} = require("./userController");

const handleApiRequest = (req, res) => {
    const url = req.url;
    if (url.startsWith('/api/auth')) {
        authController(req,res);
    }else if (url.startsWith('/api/users')) {
        userController(req,res);
    }else {
        errorController(res, new AppError('Not Found', 404));
    }
}

module.exports = handleApiRequest;