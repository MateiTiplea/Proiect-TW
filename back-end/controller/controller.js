const {authController} = require("./authController");

const handleApiRequest = (req, res) => {
    const url = req.url;
    if (url.startsWith('/api/users')) {
        authController(req,res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}

module.exports = handleApiRequest;