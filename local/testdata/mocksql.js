"use strict";
exports.__esModule = true;
var mysql = require("mysql");
var statement = require("./sqldata");
executeSql();
function executeSql() {
    var connection = connect();
    query(statement.removeTable, connection);
    query(statement.removeCorp, connection);
    query(statement.addCorp, connection);
    query(statement.addTable, connection);
    end(connection);
}
function connect() {
    return mysql.createConnection("mysql://lineserverdb:lineserverpw@localhost:3306/linemenudb");
}
function query(statement, connection) {
    connection.query(statement, function (err, results, fields) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(results);
    });
}
function end(connection) {
    connection.end();
}
