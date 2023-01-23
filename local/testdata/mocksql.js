"use strict";
exports.__esModule = true;
var console_1 = require("console");
var mysql = require("mysql");
var sql = "\nINSERT INTO Corporation (id, name) VALUES ('testcorp', 'Test Corporate');\n";
var connection = mysql.createConnection("mysql://lineserverdb:lineserverpw@localhost:3306/linemenudb");
connection.query(sql, function (err, results, fields) {
    if (err)
        throw console_1.error;
    console.log(results);
});
connection.end();
