module.exports = fn => {
    return (req, res) => {
        return fn(req, res).catch(err => {
            console.error(err.message);
            res.statusCode = 500;
            res.end('Server Error');
        });
    }
}