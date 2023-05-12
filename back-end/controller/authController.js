const {promisify} = require('util');
const users = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

const signToken = (id, username) => {
    return jwt.sign({id, username}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const signup = catchAsync(async (req, res) => {
    const user = await parseRequestBody(req);
    const result = await users.createUser(user);

    const token = signToken(result.id, result.username);

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

const login = catchAsync(async (req, res) => {
    const {username, password} = await parseRequestBody(req);

    if(!username || !password) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'fail',
            message: 'Please provide username and password'
        }));
    }

    const user = await users.getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'fail',
            message: 'Incorrect username or password'
        }));
    }


    const token = signToken(user.id, user.username);
    const response = {
        status: 'success',
        token,
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
});

const protect = catchAsync(async(req, res) =>{
   // verify the existence of the token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.'
        }));
    }

    // verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if the user still exists
    const freshUser = await users.getUserByUsername(decoded.username);
    if(!freshUser) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'fail',
            message: 'The user belonging to this token does no longer exist.'
        }));
    }
});


const authController = (req, res) => {
    const { method, url } = req;
    if (url === '/api/users' && method === 'GET') {
        // protect(req, res);
        getAllUsers(req, res);
    }
    if(url === '/api/users/signup' && method === 'POST') {
        signup(req, res);
    }
    if(url === '/api/users/login' && method === 'POST') {
        login(req, res);
    }
}

// export authController and protect functions
module.exports = {
    authController,
    protect
};