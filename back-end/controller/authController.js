const users = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const parseRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(JSON.parse(body));
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
}

const getAllUsers = catchAsync(async (req, res) => {
    const result = await users.getAllUsers();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
});

const signup = catchAsync(async (req, res) => {
    const user = await parseRequestBody(req);
    const result = await users.createUser(user);

    const token = jwt.sign( {
        id: user.id,
        username: user.username,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    const response = {
        status: 'success',
        token,
        data: {
            user: result
        }
    }

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
});

const authController = (req, res) => {
    const { method, url } = req;
    if (url === '/api/users' && method === 'GET') {
        getAllUsers(req, res);
    }
    if(url === '/api/users' && method === 'POST') {
        signup(req, res);
    }
}

module.exports = authController;