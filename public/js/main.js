function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(s => s.style.display='none');
  document.getElementById(id).style.display='block';
}

async function cargarSelectEmpleados() {
  const res = await fetch('/api/empleados');
  const empleados = await res.json();
  const select = document.getElementById('empleado_id');
  select.innerHTML = empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
}

async function cargarTabla(url, idTabla, campos) {
  const res = await fetch(url);
  const data = await res.json();
  const tbody = document.getElementById(idTabla).querySelector('tbody');
  tbody.innerHTML = data.map(row => `
    <tr>${campos.map(c => `<td>${row[c] ?? ''}</td>`).join('')}</tr>
  `).join('');
}

document.getElementById('formAsistencia').addEventListener('submit', async e => {
  e.preventDefault();
  const empleado_id = document.getElementById('empleado_id').value;
  const tipo = document.getElementById('tipo').value;
  const nota = document.getElementById('nota').value;
  const res = await fetch('/api/asistencia', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({empleado_id, tipo, nota})
  });
  const msg = await res.json();
  alert(msg.message);
  cargarTodo();
});

function cargarTodo() {
  cargarSelectEmpleados();
  cargarTabla('/api/registro_asistencia','tablaAsistencia',['id','empleado','tipo','fecha_hora','nota']);
  cargarTabla('/api/empleados','tablaEmpleados',['id','nombre','cargo','fecha_ingreso']);
  cargarTabla('/api/turnos','tablaTurnos',['id','nombre','hora_inicio','hora_fin','descripcion']);
  cargarTabla('/api/maquinas','tablaMaquinas',['id','nombre','ubicacion']);
  cargarTabla('/api/feriados','tablaFeriados',['id','fecha','nombre','descripcion']);
  cargarTabla('/api/vacaciones','tablaVacaciones',['id','empleado','fecha_inicio','fecha_fin','comentario']);
}

cargarTodo();
