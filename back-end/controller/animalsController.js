const {promisify} = require('util');
const animals = require('../model/animals');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const errorController = require('./errorController');
const parseRequestBody = require('../utils/parseRequest');
const users = require("../model/user");
const {protect, restrictTo} = require('./authController');
const {readRequestBodyBuffer, getBoundary} = require('../utils/parseRequestBuffer');
const parseMultipart = require('../utils/parseMultipart');

const getAll = catchAsync(async (req, res) => {
    const result = await animals.getAllAnimals();
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const create = catchAsync(async (req, res) => {
    const animal= await parseRequestBody(req);

    if(!animal) {
        errorController(res, new AppError('Please provide animal data', 400));
        return;
    }
    if(animal.rating){
        errorController(res, new AppError('You cannot set your own rating', 400));
        return;
    }
    if(!animal.name || !animal.binomial_name || !animal.type || !animal.climate || !animal.conservation ||!animal.origin || !animal.description || !animal.min_weight|| !animal.max_weight) {
        errorController(res, new AppError('Please provide all required fields', 400));
        return;
    }

    animal.rating = 0;
    const result = await animals.createAnimal(animal);
    const response = {
        status: 'success',
        data:{
            animal:result
        }
    }

    res.statusCode = 201;
    res.end(JSON.stringify(response));
});

const getById = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const result = await animals.getAnimalById(id);
    if(!result) {
        errorController(res, new AppError('No animal found with that ID', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const getByName = catchAsync(async (req, res) => {
    const name = processName(req.url.split('/')[3]);
    const result = await animals.getAnimalByName(name);
    if(!result) {
        errorController(res, new AppError('No animal found with that name', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const deleteAnimal = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const result = await animals.deleteAnimal(id);
    if(!result) {
        errorController(res, new AppError('No animal found with that ID', 404));
        return;
    }
    res.statusCode = 204;
    res.end();
});

const updateAnimal = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const animal = await parseRequestBody(req);
    if(!animal) {
        errorController(res, new AppError('Please provide animal data', 400));
        return;
    }
    if(animal.rating){
        errorController(res, new AppError('You cannot set your own rating', 400));
        return;
    }
    const updateFields = {};
    if(animal.binomial_name) {
        updateFields.binomial_name = animal.binomial_name;
    }
    if(animal.type) {
        updateFields.type = animal.type;
    }
    if(animal.climate) {
        updateFields.climate = animal.climate;
    }
    if(animal.conservation) {
        updateFields.conservation = animal.conservation;
    }
    if(animal.origin) {
        updateFields.origin = animal.origin;
    }
    if(animal.description) {
        updateFields.description = animal.description;
    }
    if(animal.min_weight) {
        updateFields.min_weight = animal.min_weight;
    }
    if(animal.max_weight) {
        updateFields.max_weight = animal.max_weight;
    }
    const result = await animals.updateAnimal(id, updateFields);
    if(result) {
        res.statusCode = 204;
        res.end();
    } else {
        errorController(res, new AppError('Could not update user', 500));
    }
});

const getAnimalsByType = catchAsync(async (req, res) => {
    const type = req.url.split('/')[4];
    const result = await animals.getAnimalsByType(type);
    if(!result) {
        errorController(res, new AppError('No animals found with that type', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const getAnimalsByClimate = catchAsync(async (req, res) => {
    const climate = req.url.split('/')[4];
    const result = await animals.getAnimalsByClimate(climate);
    if(!result) {
        errorController(res, new AppError('No animals found with that climate', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const getAnimalsByConservation = catchAsync(async (req, res) => {
    const conservation = req.url.split('/')[4];
    const result = await animals.getAnimalsByConservation(conservation);
    if(!result) {
        errorController(res, new AppError('No animals found with that conservation', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const getAnimalsByOrigin = catchAsync(async (req, res) => {
    const origin = req.url.split('/')[4];
    const result = await animals.getAnimalsByOrigin(origin);
    if(!result) {
        errorController(res, new AppError('No animals found with that origin', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const uploadPhoto = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const {headers} = req;

    if(await animals.validatePhoto(id)) {
        errorController(res, new AppError('Animal already has a photo! Try an update!', 400));
        return;
    }

    const contentType = headers['content-type'];
    if(!contentType || !contentType.startsWith('multipart/form-data')) {
        errorController(res, new AppError('Please provide an image', 400));
        return;
    }
    const body = await readRequestBodyBuffer(req);
    const stringBody = Buffer.concat(body).toString('binary');

    const boundary = getBoundary(req);
    if(!boundary) {
        errorController(res, new AppError('Please provide an image', 400));
        return;
    }

    const multipartData = parseMultipart(stringBody, boundary);
    if(multipartData.fileContentType !== 'image/jpeg' && multipartData.fileContentType !== 'image/png') {
        errorController(res, new AppError('Please provide an image', 400));
        return;
    }
    const result = await animals.uploadPhoto(id, multipartData.fileBodyBuffer, multipartData.fileName, multipartData.fileContentType);
    if(!result) {
        errorController(res, new AppError('Could not upload photo', 500));
        return;
    }
    res.statusCode = 204;
    res.end();
});

const getPhoto = catchAsync(async(req,res) => {
    const id = req.url.split('/')[3];
    const result = await animals.getPhoto(id);
    if(!result) {
        errorController(res, new AppError('No animal found with that ID', 404));
        return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', result.contentType);
    res.end(result.photo);
});

const updatePhoto = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const {headers} = req;

    if(!await animals.validatePhoto(id)) {
        errorController(res, new AppError('Animal does not have a photo! Try a post!', 400));
        return;
    }

    const contentType = headers['content-type'];
    if(!contentType || !contentType.startsWith('multipart/form-data')) {
        errorController(res, new AppError('Please provide an image', 400));
        return;
    }
    const body = await readRequestBodyBuffer(req);
    const stringBody = Buffer.concat(body).toString('binary');

    const boundary = getBoundary(req);
    if(!boundary) {
        errorController(res, new AppError('Please provide an image', 400));
        return;
    }

    const multipartData = parseMultipart(stringBody, boundary);
    if(multipartData.fileContentType !== 'image/jpeg' && multipartData.fileContentType !== 'image/png') {
        errorController(res, new AppError('Please provide an image', 400));
        return;
    }
    const result = await animals.updatePhoto(id, multipartData.fileBodyBuffer, multipartData.fileName, multipartData.fileContentType);
    if(!result) {
        errorController(res, new AppError('Could not update photo', 500));
        return;
    }
    res.statusCode = 204;
    res.end();
});

const getComments = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const result = await users.getComments(id);
    if(!result) {
        errorController(res, new AppError('No animal found with that ID', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const addComment = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const {comment} = await parseRequestBody(req);
    if(!comment) {
        errorController(res, new AppError('Please provide a comment', 400));
        return;
    }
    const result = await users.addComment(req.currentUser.id, id, comment);
    if(!result) {
        errorController(res, new AppError('Could not add comment', 500));
        return;
    }
    res.statusCode = 204;
    res.end();
});

const deleteMyComment = catchAsync(async (req, res) => {
    const animalId = req.url.split('/')[3];
    const commentId = req.url.split('/')[5];
    const result = await users.deleteMyComment(req.currentUser.id, animalId, commentId);
    if(!result) {
        errorController(res, new AppError('Could not delete comment', 500));
        return;
    }
    res.statusCode = 204;
    res.end();
});

const getRating = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const result = await animals.getRating(id);
    if(result === null) {
        errorController(res, new AppError('No animal found with that ID', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const addRating = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const {rating} = await parseRequestBody(req);
    if(!rating) {
        errorController(res, new AppError('Please provide a rating', 400));
        return;
    }
    const result = await animals.addRating(req.currentUser.id, id, rating);
    if(!result) {
        errorController(res, new AppError('Could not add rating', 500));
        return;
    }
    res.statusCode = 204;
    res.end();
});

const updateRating = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const {rating} = await parseRequestBody(req);
    if(!rating) {
        errorController(res, new AppError('Please provide a rating', 400));
        return;
    }
    const result = await animals.updateRating(req.currentUser.id, id, rating);
    if(!result) {
        errorController(res, new AppError('Could not update rating', 500));
        return;
    }
    res.statusCode = 204;
    res.end();
});

const search = catchAsync(async (req, res) => {
    const searchQuery = processName(req.url.split('/')[3].split('=')[1]);
    const result = await animals.search(searchQuery);
    if(!result) {
        errorController(res, new AppError('No animals found for that search', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const getCriteria = catchAsync(async (req, res) => {
    const searchDict = await parseRequestBody(req);
    const result = await animals.getCriteria(searchDict);
    if(!result) {
        errorController(res, new AppError('No animals found for that search', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});

const getMyRating = catchAsync(async (req, res) => {
const id = req.url.split('/')[3];
    const result = await animals.getMyRating(req.currentUser.id, id);
    if(result === null) {
        errorController(res, new AppError('No comment found', 404));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify({
        status: 'success',
        data: {
            rating: result
        }
    }));
});

const processName = (name) => {
    return name.replace(/%20/g, ' ');
}

const animalsController = catchAsync(async (req, res) => {
    const { url,method } = req;
    res.setHeader('Content-Type', 'application/json');
    if(url === '/api/animals' && method === 'POST') {
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        if(!restrictTo(res, logUser, 'admin')) {
            return;
        }
        create(req, res);
    } else if(url === '/api/animals' && method === 'GET') {
        getAll(req, res);
    } else if(url.match(/\/api\/animals\/type\/([a-zA-Z]+)/) && method === 'GET'){
        getAnimalsByType(req, res);
    } else if(url.match(/\/api\/animals\/climate\/([a-zA-Z]+)/) && method === 'GET'){
        getAnimalsByClimate(req, res);
    } else if(url.match(/\/api\/animals\/conservation\/([a-zA-Z]+)/) && method === 'GET'){
        getAnimalsByConservation(req, res);
    } else if(url.match(/\/api\/animals\/region\/([a-zA-Z]+)/) && method === 'GET'){
        getAnimalsByOrigin(req, res);
    } else if(url.match(/\/api\/animals\/search=([0-9A-Za-z]+)/) && method === 'GET'){
        search(req, res);
    } else if(url === '/api/animals/criteria' && method === 'POST'){
        getCriteria(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/photo/) && method === 'POST'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        if(!restrictTo(res, logUser, 'admin')) {
            return;
        }
        uploadPhoto(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/photo/) && method === 'PUT'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        if(!restrictTo(res, logUser, 'admin')) {
            return;
        }
        updatePhoto(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/photo/) && method === 'GET'){
        getPhoto(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/comments/) && method === 'GET'){
        getComments(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/comments/) && method === 'POST'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        addComment(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/comments\/([0-9]+)/) && method === 'DELETE'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        deleteMyComment(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/rating/) && method === 'GET'){
        getRating(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/myRating/) && method === 'GET'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        getMyRating(req, res);
    }
    else if(url.match(/\/api\/animals\/([0-9]+)\/rating/) && method === 'POST'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        addRating(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)\/rating/) && method === 'PUT'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        updateRating(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)/) && method === 'GET') {
        getById(req, res);
    } else if(url.match(/\/api\/animals\/([a-zA-Z]+)/) && method === 'GET') {
        getByName(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)/) && method === 'DELETE'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        if(!restrictTo(res, logUser, 'admin')) {
            return;
        }
        deleteAnimal(req, res);
    } else if(url.match(/\/api\/animals\/([0-9]+)/) && method === 'PATCH'){
        const logUser = await protect(req, res);
        if(!logUser) {
            return;
        }
        if(!restrictTo(res, logUser, 'admin')) {
            return;
        }
        updateAnimal(req, res);
    }
    else {
        errorController(res, new AppError('Not Found', 404));
    }
});

module.exports = {
    animalsController
};