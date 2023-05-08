const userController = require('./userController');

const handleApiRequest = (req, res) => {
    const url = req.url;
    if (url.startsWith('/api/users')) {
        userController(req,res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}

module.exports = handleApiRequest;