import { Client } from "pg";
import * as statement from "./sqldata";

executeSql();
async function executeSql() {
  const connection = await connect();
  await query(statement.removeTable, connection);
  await query(statement.removeCorp, connection);
  await query(statement.addCorp, connection);
  await query(statement.addTable, connection);
  await end(connection);
  console.log("migration done");
}
const credentials = {
  user: "postgres",
  host: "localhost",
  database: "nodedemo",
  password: "yourpassword",
  port: 5432,
};

async function connect() {
  const client = new Client(credentials);
  await client.connect();
  return client;
}

async function query(statement: string, connection: Client) {
  const result = await connection.query(statement);
  console.log(result);
}

function end(connection: Client) {
  connection.end();
}
