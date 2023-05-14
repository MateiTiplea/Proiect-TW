const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const handleApiRequest = require('./controller/controller');
const oracle = require('oracledb');
const handleViewRequest = require('./view/viewController');

oracle.createPool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTSTRING,
    poolAlias: 'zoodb',
    poolMax: 10,
    poolMin: 10,
    poolIncrement: 0
}).then(() => {
    console.log('Connection pool started');
}).catch(err => {
    console.error(err.message);
    process.exit(1);
});

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url.startsWith('/api')) {
        handleApiRequest(req, res);
    } else {
        handleViewRequest(req, res);
    }
});

const port = 3000;
const host = 'localhost';
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
