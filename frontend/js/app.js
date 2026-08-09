const API_URL = "http://localhost:3000";

let modoEdicion = false;
let idEditando = null;

$(document).ready(function () {
  listarEstudiantes();

  $("#btnRecargar").click(function () {
    listarEstudiantes();
  });

  $("#btnLimpiar").click(function () {
    limpiarFormulario();
  });

  $("#nota1, #nota2, #nota3").on("input", function () {
    calcularPromedio();
  });

  $("#formEstudiante").submit(function (event) {
    event.preventDefault();

    if (modoEdicion) {
      actualizarEstudiante(idEditando);
    } else {
      insertarEstudiante();
    }
  });

  $(".consulta-btn").click(function () {
    const consulta = $(this).data("consulta");
    ejecutarConsulta(consulta);
  });
});

function mostrarAlerta(mensaje, tipo = "success") {
  $("#alerta")
    .removeClass("d-none alert-success alert-danger alert-warning alert-info")
    .addClass(`alert-${tipo}`)
    .text(mensaje);

  setTimeout(function () {
    $("#alerta").addClass("d-none");
  }, 3500);
}

function calcularPromedio() {
  const nota1 = Number($("#nota1").val()) || 0;
  const nota2 = Number($("#nota2").val()) || 0;
  const nota3 = Number($("#nota3").val()) || 0;

  if (nota1 || nota2 || nota3) {
    const promedio = ((nota1 + nota2 + nota3) / 3).toFixed(2);
    $("#promedio").val(Number(promedio));
  }
}

function obtenerDatosFormulario() {
  return {
    _id: $("#id").val().trim(),
    nombre_estudiante: $("#nombre_estudiante").val().trim(),
    materia: $("#materia").val(),
    nota1: Number($("#nota1").val()),
    nota2: Number($("#nota2").val()),
    nota3: Number($("#nota3").val()),
    promedio: Number($("#promedio").val()),
    condicion: $("#condicion").val(),
    cuatrimestre: Number($("#cuatrimestre").val())
  };
}

function limpiarFormulario() {
  modoEdicion = false;
  idEditando = null;

  $("#formEstudiante")[0].reset();
  $("#promedio").val("");
  $("#id").prop("disabled", false);

  $("#btnGuardar")
    .text("Guardar")
    .removeClass("btn-warning")
    .addClass("btn-success");
}

function listarEstudiantes() {
  $.ajax({
    url: `${API_URL}/api/estudiantes`,
    method: "GET",
    success: function (estudiantes) {
      const tbody = $("#tablaEstudiantes");
      tbody.empty();

      estudiantes.forEach(function (estudiante) {
        tbody.append(`
          <tr>
            <td>${estudiante._id}</td>
            <td>${estudiante.nombre_estudiante}</td>
            <td>${estudiante.materia}</td>
            <td>${estudiante.nota1}, ${estudiante.nota2}, ${estudiante.nota3}</td>
            <td>${estudiante.promedio}</td>
            <td>
              <span class="badge ${claseCondicion(estudiante.condicion)}">
                ${estudiante.condicion}
              </span>
            </td>
            <td>${estudiante.cuatrimestre}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" onclick="cargarParaEditar('${estudiante._id}')">
                Editar
              </button>
              <button class="btn btn-sm btn-danger" onclick="eliminarEstudiante('${estudiante._id}')">
                Eliminar
              </button>
            </td>
          </tr>
        `);
      });
    },
    error: function () {
      mostrarAlerta(
        "No se pudieron cargar los estudiantes. Verifique que el API esté encendido con npm run dev.",
        "danger"
      );
    }
  });
}

function claseCondicion(condicion) {
  if (condicion === "Aprobado") {
    return "bg-success";
  }

  if (condicion === "Ampliación") {
    return "bg-warning text-dark";
  }

  return "bg-danger";
}

function insertarEstudiante() {
  const estudiante = obtenerDatosFormulario();

  $.ajax({
    url: `${API_URL}/api/estudiantes`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(estudiante),
    success: function () {
      mostrarAlerta("Estudiante insertado correctamente.");
      limpiarFormulario();
      listarEstudiantes();
    },
    error: function (xhr) {
      const mensaje = xhr.responseJSON?.error || "Error al insertar estudiante.";
      mostrarAlerta(mensaje, "danger");
    }
  });
}

function cargarParaEditar(id) {
  $.ajax({
    url: `${API_URL}/api/estudiantes/${id}`,
    method: "GET",
    success: function (estudiante) {
      modoEdicion = true;
      idEditando = estudiante._id;

      $("#id").val(estudiante._id).prop("disabled", true);
      $("#nombre_estudiante").val(estudiante.nombre_estudiante);
      $("#materia").val(estudiante.materia);
      $("#nota1").val(estudiante.nota1);
      $("#nota2").val(estudiante.nota2);
      $("#nota3").val(estudiante.nota3);
      $("#promedio").val(estudiante.promedio);
      $("#condicion").val(estudiante.condicion);
      $("#cuatrimestre").val(estudiante.cuatrimestre);

      $("#btnGuardar")
        .text("Actualizar")
        .removeClass("btn-success")
        .addClass("btn-warning");

      window.location.href = "#estudiantes";
    },
    error: function () {
      mostrarAlerta("No se pudo cargar el estudiante.", "danger");
    }
  });
}

function actualizarEstudiante(id) {
  const estudiante = obtenerDatosFormulario();

  delete estudiante._id;

  $.ajax({
    url: `${API_URL}/api/estudiantes/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(estudiante),
    success: function () {
      mostrarAlerta("Estudiante actualizado correctamente.");
      limpiarFormulario();
      listarEstudiantes();
    },
    error: function (xhr) {
      const mensaje = xhr.responseJSON?.error || "Error al actualizar estudiante.";
      mostrarAlerta(mensaje, "danger");
    }
  });
}

function eliminarEstudiante(id) {
  const confirmar = confirm(`¿Desea eliminar el estudiante ${id}?`);

  if (!confirmar) {
    return;
  }

  $.ajax({
    url: `${API_URL}/api/estudiantes/${id}`,
    method: "DELETE",
    success: function () {
      mostrarAlerta("Estudiante eliminado correctamente.");
      listarEstudiantes();
    },
    error: function () {
      mostrarAlerta("Error al eliminar estudiante.", "danger");
    }
  });
}

function ejecutarConsulta(tipo) {
  const nombreCompleto = encodeURIComponent($("#paramNombreCompleto").val());
  const nombreCorto = encodeURIComponent($("#paramNombreCorto").val());
  const cuatrimestre = $("#paramCuatrimestre").val();

  let url = "";

  if (tipo === "excelencia") {
    url = `${API_URL}/api/consultas/excelencia?nombre=${nombreCompleto}`;
  }

  if (tipo === "cuatrimestreNombre") {
    url = `${API_URL}/api/consultas/cuatrimestre-nombre?cuatrimestre=${cuatrimestre}&nombre=${nombreCorto}`;
  }

  if (tipo === "reprobados") {
    url = `${API_URL}/api/consultas/reprobados`;
  }

  if (tipo === "promedioCuatrimestre") {
    url = `${API_URL}/api/consultas/promedio-cuatrimestre?cuatrimestre=${cuatrimestre}`;
  }

  if (tipo === "notaBaja") {
    url = `${API_URL}/api/consultas/nota-baja?cuatrimestre=${cuatrimestre}&nombre=${nombreCompleto}`;
  }

  if (tipo === "promedioLiteratura") {
    url = `${API_URL}/api/consultas/promedio-literatura?cuatrimestre=${cuatrimestre}`;
  }

  $.ajax({
    url: url,
    method: "GET",
    success: function (resultado) {
      $("#resultadoConsulta").text(JSON.stringify(resultado, null, 2));
    },
    error: function () {
      $("#resultadoConsulta").text(
        "Error al ejecutar la consulta. Verifique que el API esté activo."
      );
    }
  });
}