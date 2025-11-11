import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "bkoxdnwsbsjlh7g92nkv-mysql.services.clever-cloud.com",
  port: 3306,
  user: "uvcrwro1t4mesn3b",
  password: "nxvhyOBT98OKXXhhLya4",
  database: "bkoxdnwsbsjlh7g92nkv"
});

console.log("✅ Conectado a Clever Cloud MySQL");
