import express from "express";
import { db } from "./db.js";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Obtener lista de empleados activos
app.get("/api/empleados", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nombre FROM empleados WHERE activo = 1 ORDER BY nombre");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener empleados:", error);
    res.status(500).json({ success: false, message: "Error al obtener empleados" });
  }
});

// Registrar nuevo empleado
app.post("/api/empleados", async (req, res) => {
  const { nombre, identificacion, cargo_id, fecha_ingreso, comentario } = req.body;

  try {
    await db.query(
      `INSERT INTO empleados (nombre, identificacion, cargo_id, fecha_ingreso, activo, comentario)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [nombre, identificacion, cargo_id || null, fecha_ingreso || null, comentario || null]
    );

    res.json({ success: true, message: "Empleado agregado correctamente" });
  } catch (error) {
    console.error("❌ Error al agregar empleado:", error);
    res.status(500).json({ success: false, message: "Error al registrar empleado" });
  }
});

//  Registrar asistencia
app.post("/api/asistencia", async (req, res) => {
  const { empleado_id, tipo, nota } = req.body;

  try {
    await db.query(
      "INSERT INTO registro_asistencia (empleado_id, tipo, marca_ts, nota) VALUES (?, ?, NOW(), ?)",
      [empleado_id, tipo, nota || null]
    );
    res.json({ success: true, message: "Asistencia registrada correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar asistencia:", error);
    res.status(500).json({ success: false, message: "Error al registrar asistencia" });
  }
});

//  Mostrar los últimos 10 registros
app.get("/api/asistencia", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ra.id, e.nombre, ra.tipo, ra.marca_ts, ra.nota
      FROM registro_asistencia ra
      JOIN empleados e ON ra.empleado_id = e.id
      ORDER BY ra.marca_ts DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener asistencia:", error);
    res.status(500).json({ success: false, message: "Error al obtener registros de asistencia" });
  }
});

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

//  Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
