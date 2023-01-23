import { error } from "console";
import * as mysql from "mysql";

const sql = `
INSERT INTO Corporation (id, name) VALUES ('testcorp', 'Test Corporate');
`;

const connection = mysql.createConnection(
  "mysql://lineserverdb:lineserverpw@localhost:3306/linemenudb"
);

connection.query(sql, (err, results, fields) => {
  if (err) throw error;
  console.log(results);
});

connection.end();
