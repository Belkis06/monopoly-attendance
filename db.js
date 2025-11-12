// db.js
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "bkoxdnwsbsjlh7g92nkv-mysql.services.clever-cloud.com",
  user: "uvcrwro1t4mesn3b",
  password: "nxvhyOBT98OKXXhhLya4",
  database: "bkoxdnwsbsjlh7g92nkv",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión
db.getConnection()
  .then(connection => {
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  })
  .catch(err => {
    console.error('Error de conexión a la base de datos:', err);
  });           
   