import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "bnw4nsactvtxlhijrkr1-mysql.services.clever-cloud.com",
  port: 3306,
  user: "u7xcbg0zym9pquju",
  password: "S4HNdBjggT2HL77zxQkz",
  database: "bnw4nsactvtxlhijrkr1"
});

console.log("✅ Conectado a Clever Cloud MySQL");
