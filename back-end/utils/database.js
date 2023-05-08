const oracle = require('oracledb');
const catchAsync = require('./catchAsync');

const db_config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTSTRING
}

const dbWrapper = (fn) => {
    return catchAsync(async(req, res) => {
        const connection = await oracle.getConnection(db_config);
        return fn(req, res, connection);
    });
};

module.exports = dbWrapper;