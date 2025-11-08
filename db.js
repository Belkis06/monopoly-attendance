import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "1234",
  database: "monopoly_attendance"
});

console.log("✅ Conectado a MariaDB");
