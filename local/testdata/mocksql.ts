import * as mysql from "mysql";
import * as statement from "./sqldata";

executeSql();
function executeSql() {
  const connection = connect();
  query(statement.removeTable, connection);
  query(statement.removeCorp, connection);
  query(statement.addCorp, connection);
  query(statement.addTable, connection);
  end(connection);
}

function connect() {
  return mysql.createConnection(
    "mysql://lineserverdb:lineserverpw@localhost:3306/linemenudb"
  );
}

function query(statement: string, connection: mysql.Connection) {
  connection.query(statement, (err, results, fields) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(results);
  });
}

function end(connection: mysql.Connection) {
  connection.end();
}
