const handleApiRequest = (req, res) => {
    const url = req.url;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const response = {
        message: 'Hello World'
    }
    res.end(JSON.stringify(response));
}

module.exports = handleApiRequest;