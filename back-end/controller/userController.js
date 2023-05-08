const userController = (req, res) => {
    const { method, url } = req;
    if (url === '/api/users' && method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Get all users' }));
    }
}

module.exports = userController;