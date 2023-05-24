const fs = require('fs');
const path = require('path');
const {getAnimalByName}=require('../model/animals');
const {getComments}=require('../model/user');
const bcrypt = require('bcryptjs');
const {promisify} = require("util");
const jwt = require("jsonwebtoken");

const mimeLookup = {
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.gif': 'image/gif',
};

const descriptionFile=fs.readFileSync('./view/templates/animal-description.html',"utf-8");
const animalsTemplate=async (animalName)=>{
    const animal=await getAnimalByName(animalName);
    let modifyFile=descriptionFile;
    modifyFile = modifyFile.replace("{ANIMAL_NAME}",animal.name);
    modifyFile = modifyFile.replace("{BINOMIAL_NAME}",animal.binomial_name);
    modifyFile = modifyFile.replace("{REGION}",animal.origin);
    modifyFile = modifyFile.replace("{CONSERVATION}",animal.conservation);
    modifyFile = modifyFile.replace("{TYPE}",animal.type);
    modifyFile = modifyFile.replace("{CLIMATE}",animal.climate);
    modifyFile = modifyFile.replace("{DESCRIPTION}",animal.description);

    let commentsSection="";
    const dbComments = await getComments(animal.id);
    const commentsHtml = dbComments.map((comment) => {
        const formattedDate = new Date(comment.date_created).toLocaleString();
        return `
            <div class="list">
                <div class="user">
                    <div class="user-meta">
                        <div class="name">${comment.username}</div>
                        <div class="date">${formattedDate}</div>
                    </div>
                </div>
                <div class="comment-post">${comment.comment}</div>
            </div>`;
    });
    commentsSection = commentsHtml.join('\n');
    modifyFile = modifyFile.replace("{COMMENT_SECTION}",commentsSection);

    return modifyFile;
}

const respondFile = (req, res, filePath) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(`./view/templates/${filePath}`, (err, data) => {
        if(err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
        } else {
            res.end(data);
        }
    });
}

const handleViewRequest = (req, res) => {
    if(req.url === '/' || req.url === '/home'){
        respondFile(req, res, 'index.html');
    } else if(req.url === '/bookTickets'){
        respondFile(req, res, 'book_tickets.html');
    } else if(req.url === '/aboutUs'){
        respondFile(req, res, 'about_us.html');
    } else if(req.url === '/login'){
        respondFile(req, res, 'login.html');
    } else if(req.url === '/signup'){
        respondFile(req, res, 'signup.html');
    } else if(req.url === '/forgotPassword'){
        respondFile(req, res, 'forgot_pass.html');
    } else if(req.url === '/account'){
        respondFile(req, res, 'account_settings.html');
    } else if(req.url === '/animals'){
        respondFile(req, res, 'animals.html');
    }else if (req.url.match(/\/animal=([a-zA-Z]+)/)){
        const animalName=req.url.split('=')[1];
        animalsTemplate(animalName).then((data)=>{
            res.statusCode=200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    }
    else{
        const fileUrl = '/public' + req.url;
        const filepath = path.resolve('.' + fileUrl);
        const fileExt = path.extname(filepath);
        // check if the file exists
        fs.access(filepath, fs.constants.F_OK, (err) => {
            if(err) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                // read the file content
                fs.readFile(filepath, (err, data) => {
                    if(err) {
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', mimeLookup[fileExt]);
                        res.end(data);
                    }
                });
            }
        });
    }
};

module.exports = handleViewRequest;