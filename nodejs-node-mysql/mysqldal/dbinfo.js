var mysql = require('mysql');
var config = require('../config/');
exports.connection = mysql.createConnection(config.mysqlDb);
exports.pool = mysql.createPool(config.mysqlDb);
