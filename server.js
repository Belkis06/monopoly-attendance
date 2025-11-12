import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------------------
// POOL DE CONEXIONES
// ---------------------
const pool = mysql.createPool({
    host: "bkoxdnwsbsjlh7g92nkv-mysql.services.clever-cloud.com",
    user: "uvcrwro1t4mesn3b",
    password: "nxvhyOBT98OKXXhhLya4",
    database: "bkoxdnwsbsjlh7g92nkv",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ---------------------
// RUTAS
// ---------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Empleados activos
app.get("/api/empleados", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.id, e.nombre, e.identificacion, c.nombre AS cargo
            FROM empleados e
            JOIN cargos c ON e.cargo_id = c.id
            WHERE e.activo = 1
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registro de asistencia
app.get("/api/asistencia", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT ra.id, e.nombre AS empleado, m.ubicacion AS maquina, ra.tipo, ra.marca_ts, ra.nota
            FROM registro_asistencia ra
            JOIN empleados e ON ra.empleado_id = e.id
            LEFT JOIN maquinas m ON ra.maquina_id = m.id
            ORDER BY ra.marca_ts DESC
            LIMIT 50
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar asistencia
app.post("/api/asistencia", async (req, res) => {
    const { empleado_id, tipo } = req.body;
    if (!empleado_id || !tipo) return res.status(400).json({ error: "Empleado y tipo son requeridos" });

    try {
        await pool.query(`
            INSERT INTO registro_asistencia (empleado_id, tipo, marca_ts)
            VALUES (?, ?, NOW())
        `, [empleado_id, tipo]);
        res.json({ message: "Asistencia registrada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Turnos
app.get("/api/turnos", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT t.id, e.nombre AS empleado, t.hora_inicio, t.hora_fin, t.descripcion
            FROM turnos t
            JOIN empleados e ON t.empleado_id = e.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Máquinas
app.get("/api/maquinas", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.id, e.nombre AS empleado, m.ubicacion
            FROM maquinas m
            JOIN empleados e ON m.empleado_id = e.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Feriados
app.get("/api/feriados", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT f.id, f.fecha, e.nombre AS empleado, f.descripcion
            FROM feriados f
            LEFT JOIN empleados e ON f.empleado_id = e.id
            ORDER BY f.fecha
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vacaciones
app.get("/api/vacaciones", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.id, e.nombre AS empleado, v.fecha_inicio, v.fecha_fin, v.comentario
            FROM vacaciones v
            JOIN empleados e ON v.empleado_id = e.id
            ORDER BY v.fecha_inicio DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------------
// INICIAR SERVIDOR
// ---------------------
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
