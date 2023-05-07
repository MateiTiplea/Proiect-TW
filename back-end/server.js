const http = require('http');
const handleApiRequest = require('./controller/controller');
const con = require('./database');

con.connect().then(() => {
    console.log('Connected to Oracle Database');
}).catch(err => {
    console.log(err);
});

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/api') {
        handleApiRequest(req, res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const port = 3000;
const host = 'localhost';
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
