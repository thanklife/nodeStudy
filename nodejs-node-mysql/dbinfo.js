//app-pooling.js

var mysql = require('mysql');
var benji = {
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'nodejs',
    port: 3306
};

var qiv = {
    host: '218.206.201.27',
    user: 'sa',
    password: 'AustinSuixinhu',
    database: 'qiv',
    port: 3306
}

exports.pool = mysql.createPool(qiv);


