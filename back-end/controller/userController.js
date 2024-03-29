const catchAsync = require('../utils/catchAsync');
const users = require("../model/user");
const errorController = require("./errorController");
const AppError = require("../utils/appError");
const {protect, restrictTo} = require('./authController');
const parseRequestBody = require('../utils/parseRequest');

const getAllUsers = catchAsync(async (req, res) => {
    const result = await users.getAllUsers();
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const deleteUserById = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const result = await users.deleteUserById(id);
    if(result) {
        res.statusCode = 204;
        res.end();
    } else {
        errorController(res, new AppError('User not found', 404));
    }
});

const deleteSelf = catchAsync(async (req, res) => {
    const id = req.currentUser.id;
    const result = await users.deleteUserById(id);
    if(result) {
        res.statusCode = 204;
        res.end();
    } else {
        errorController(res, new AppError('User not found', 404));
    }
});

const updateSelf = catchAsync(async (req, res) => {
    const id = req.currentUser.id;
    const {email, first_name, last_name, phone, theme} = await parseRequestBody(req);
    const updatedFields = {};
    if(email) {
        updatedFields.email = email;
    }
    if(first_name) {
        updatedFields.first_name = first_name;
    }
    if(last_name) {
        updatedFields.last_name = last_name;
    }
    if(phone) {
        updatedFields.phone = phone;
    }
    if(theme) {
        updatedFields.theme = theme;
    }
    const result = await users.updateUserById(id, updatedFields);
    if(result) {
        res.statusCode = 204;
        res.end();
    } else {
        errorController(res, new AppError('Could not update user', 500));
    }
});

const bookTicket = catchAsync(async (req, res) => {
    const id = req.currentUser.id;
    const {name, phone, book_date, adult_tickets, student_tickets, kids_tickets} = await parseRequestBody(req);
    if(!name || !phone || !book_date) {
        errorController(res, new AppError('Please provide all required fields', 400));
        return;
    }
    if(!adult_tickets && !student_tickets && !kids_tickets) {
        errorController(res, new AppError('Please provide at least one ticket field', 400));
        return;
    }
    const ticket = {
        name, phone, book_date, adult_tickets, student_tickets, kids_tickets
    }
    const result = await users.bookTicket(id, ticket);
    const response = {
        status: 'success',
        data: {
            ticket: result
        }
    };
    res.statusCode = 201;
    res.end(JSON.stringify(response));
});

const getMyBookings = catchAsync(async (req, res) => {
    const id = req.currentUser.id;
    const result = await users.getBookings(id);
    const response = {
        status: 'success',
        data: {
            tickets: result
        }
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
});

const getFavorites = catchAsync(async (req, res) => {
    const id = req.currentUser.id;
    const result = await users.getFavorites(id);
    const response = {
        status: 'success',
        data: {
            favorites: result
        }
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
});

const addFavorite = catchAsync(async (req, res) => {
    const id = req.currentUser.id;
    const {animal_id} = await parseRequestBody(req);
    if(!animal_id) {
        errorController(res, new AppError('Please provide all required fields', 400));
        return;
    }
    const result = await users.addFavorite(id, animal_id);
    if(result) {
        res.statusCode = 204;
        res.end();
    } else{
        errorController(res, new AppError('Animal not found', 404));
    }
});

const deleteFavorite = catchAsync(async (req, res) => {
    const id = req.currentUser.id;
    const animal_id = req.url.split('/')[4];
    const result = await users.deleteFavorite(id, animal_id);
    if(result) {
        res.statusCode = 204;
        res.end();
    } else {
        errorController(res, new AppError('Animal not found', 404));
    }
});

const getSelf = catchAsync(async (req, res) => {
    res.statusCode = 200;
    res.end(JSON.stringify({
        status: 'success',
        data: req.currentUser
    }));
});

const userController = catchAsync(async(req,res) => {
    const {url, method} = req;
    res.setHeader('Content-Type', 'application/json');
    if (url === '/api/users' && method === 'GET') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        if(!restrictTo(res, logUser, 'admin')) {
            return;
        }
        getAllUsers(req, res);
    } else if(url.match(/\/api\/users\/([0-9]+)/) && method === 'DELETE') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        if(!restrictTo(res, logUser, 'admin')) {
            return;
        }
        deleteUserById(req, res);
    } else if(url === '/api/users/self' && method === 'GET') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        getSelf(req, res);
    }
    else if (url === '/api/users/deleteSelf' && method === 'DELETE') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        deleteSelf(req, res);
    } else if (url === '/api/users/updateSelf' && method === 'PATCH') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        updateSelf(req, res);
    } else if (url === '/api/users/bookings' && method === 'POST') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        bookTicket(req, res);
    } else if (url === '/api/users/bookings' && method === 'GET') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        getMyBookings(req, res);
    } else if (url === '/api/users/favorites' && method === 'GET') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        getFavorites(req, res);
    } else if (url === '/api/users/favorites' && method === 'POST') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        addFavorite(req, res);
    } else if (url.match(/\/api\/users\/favorites\/([0-9]+)/) && method === 'DELETE') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        deleteFavorite(req, res);
    }
    else {
        errorController(res, new AppError('Not Found', 404));
    }
});

module.exports = {
    userController
};