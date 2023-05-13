const {promisify} = require('util');
const animals = require('../model/animals');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const errorController = require('./errorController');
const parseRequestBody = require('../utils/parseRequest');
const users = require("../model/user");
const getAll = catchAsync(async (req, res) => {
    const result = await animals.getAllAnimals();
    res.statusCode = 200;
    res.end(JSON.stringify(result));
});
const create = catchAsync(async (req, res) => {
    const animal= await parseRequestBody(req);
  console.log(animal);

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
    console.log(animal);
    const response = {
        status: 'success',
        data:{
            animal:result
        }
    }

    res.statusCode = 201;
    res.end(JSON.stringify(response));
});


const animalsController = catchAsync(async (req, res) => {
    const { url,method } = req;
    res.setHeader('Content-Type', 'application/json');
    console.log("inainte de if");
    if(url === '/api/animals/create' && method === 'POST') {
        console.log("sunt aici");
        create(req, res);
    } else if(url === '/api/animals/getAll' && method === 'GET') {
        getAll(req, res);
    } else if(url === '/api/animals/getById' && method === 'GET') {
        getById(req, res);
    }  if(url === '/api/animals/getByName' && method === 'GET') {
        getByName(req, res);
    }
    else {
        errorController(res, new AppError('Not Found', 404));
    }
});
module.exports = {
    animalsController
};