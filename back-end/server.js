const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const handleApiRequest = require('./controller/controller');


const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(url);
    if (url.startsWith('/api')) {
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
