// Scripts/ServicioSede.js

// URL base de tu servicio de API
var BaseURL = "http://spapersonas2025.runasp.net/"; // Reemplaza con la URL base real de tu API

document.addEventListener("DOMContentLoaded", function () {
    console.log("ServicioSede.js cargado. Iniciando carga de datos...");

    // Carga el menu HTML en el div con id "dvMenu"
    $("#dvMenu").load("../Paginas/Menu.html", function (response, status, xhr) {
        if (status == "error") {
            console.error("Error al cargar Menu.html:", xhr.status, xhr.statusText, xhr);
            alert("Error al cargar el menu. Verifique la ruta.");
        } else {
            // Inicializa los dropdowns de Bootstrap despues de cargar el menu
            $('.dropdown-toggle').dropdown();
            console.log("Menu cargado y dropdowns inicializados.");
        }
    });

    // Llama a las funciones para listar las asociaciones y llenar los combos
    ListarServiciosSede();
    LlenarCombos();

    // Asigna evento a los botones de la parte superior
    $("#btnInsertar").on("click", function () {
        console.log("Boton Insertar clickeado.");
        EjecutarComando("POST", "Insertar");
    });

    // El boton Actualizar superior y Eliminar superior han sido eliminados del HTML.
    // Sus eventos correspondientes tambien se eliminan de aqui.

    $("#btnLimpiar").on("click", function () {
        console.log("Boton Limpiar Campos clickeado.");
        LimpiarCamposServicioSede();
    });

    // Evento para el boton de ELIMINAR en la tabla (delegacion de eventos)
    // Este boton ejecuta directamente la eliminacion de la fila usando su ID único
    $('#tblServicioSede tbody').on('click', '.btn-eliminar', function () {
        console.log("Boton Eliminar de tabla clickeado.");
        let idEliminar = $(this).data('id'); // Obtener el ID único de la asociacion del atributo data-id

        // Validar que el ID sea válido antes de proceder
        if (!idEliminar || idEliminar === 0) {
            alert("No se pudo obtener el ID de la asociacion para eliminar.");
            return;
        }

        // Confirmacion antes de eliminar
        if (confirm("Esta seguro que desea eliminar esta asociacion?")) {
            console.log(`Eliminando asociacion con ID: ${idEliminar}`);
            // Llamar a EjecutarComando para eliminar, pasando un objeto con la propiedad Id
            EjecutarComando("DELETE", "Eliminar", { Id: parseInt(idEliminar) });
        }
    });
});

// Funcion para obtener los datos del formulario (combos)
function ObtenerDatosServicioSede() {
    let idSede = $("#cboSede").val();
    let idServicio = $("#cboServicio").val();

    if (idSede === "0" || idServicio === "0") {
        alert("Por favor, seleccione una sede y un servicio.");
        return null;
    }
    // Devolvemos el objeto con IdSede y IdServicio (Id se dejará como null para inserción)
    return new ServicioSede(null, parseInt(idSede), parseInt(idServicio));
}

// Funcion para listar todas las asociaciones Servicio-Sede en la tabla
function ListarServiciosSede() {
    let URL = BaseURL + "api/Servicio_Sede/ConsultarTodos"; // Ajusta la ruta de tu API (sin espacio)
    console.log("Intentando listar servicios por sede desde URL:", URL);

    // Obtener el token de las cookies
    const token = getCookie("token"); // Asume que getCookie esta disponible globalmente

    $.ajax({
        type: "GET",
        url: URL,
        headers: {
            'Authorization': 'Bearer ' + token // Usa el token para autenticacion
        },
        success: function (response) {
            console.log("Respuesta exitosa de ListarServiciosSede:", response);
            let htmlContent = "";
            let tablaBody = document.getElementById("tblServicioSede").getElementsByTagName('tbody')[0];

            // Limpiar la tabla antes de llenarla
            tablaBody.innerHTML = "";

            if (response && response.length > 0) {
                response.forEach(asociacion => {
                    // Se muestran Id, IdSede e IdServicio
                    htmlContent += `
                    <tr>
                        <td>${asociacion.Id}</td> <!-- Columna para el ID único -->
                        <td>${asociacion.IdSede}</td>
                        <td>${asociacion.IdServicio}</td>
                        <td>
                            <button class="btn btn-sm btn-danger w-100 btn-eliminar" 
                                data-id="${asociacion.Id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                    `;
                });
            } else {
                // Colspan ajustado a 4 porque ahora hay 4 columnas visibles (Id, IdSede, IdServicio, Acciones)
                htmlContent = `<tr><td colspan="4" class="text-center">No hay asociaciones de servicio por sede.</td></tr>`;
                console.log("La API de ServicioSedes no devolvio datos.");
            }
            tablaBody.innerHTML = htmlContent;
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud ListarServiciosSede:", xhr.status, xhr.statusText, xhr.responseText, xhr);
            alert("Error al cargar las asociaciones de servicio por sede.\n" + xhr.responseText);
        }
    });
}

// Funcion para llenar los combos de Sedes y Servicios
function LlenarCombos() {
    // Obtener el token de las cookies
    const token = getCookie("token"); // Asume que getCookie esta disponible globalmente

    // Llenar combo de Sedes
    let URLSedes = BaseURL + "api/Sede/ConsultarTodos"; // Ajusta la ruta de tu API de Sedes
    console.log("Intentando llenar combo de Sedes desde URL:", URLSedes);
    $.ajax({
        type: "GET",
        url: URLSedes,
        headers: {
            'Authorization': 'Bearer ' + token // Usa el token para autenticacion
        },
        success: function (response) {
            console.log("Respuesta exitosa de LlenarCombo Sedes:", response);
            $("#cboSede").empty();
            $("#cboSede").append('<option selected="selected" value="0">Seleccione una sede</option>');
            if (response && response.length > 0) {
                response.forEach(sede => {
                    $("#cboSede").append('<option value="' + sede.Id + '">' + sede.Nombre + '</option>');
                });
            }
            // Inicializar Select2 despues de llenar el combo
            $("#cboSede").select2({
                theme: 'bootstrap4'
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar combo de Sedes:", xhr.status, xhr.statusText, xhr.responseText, xhr);
            alert("Error al cargar las sedes.\n" + xhr.responseText);
        }
    });

    // Llenar combo de Servicios
    let URLServicios = BaseURL + "api/Servicio/ConsultarTodos"; // Ajusta la ruta de tu API de Servicios
    console.log("Intentando llenar combo de Servicios desde URL:", URLServicios);
    $.ajax({
        type: "GET",
        url: URLServicios,
        headers: {
            'Authorization': 'Bearer ' + token // Usa el token para autenticacion
        },
        success: function (response) {
            console.log("Respuesta exitosa de LlenarCombo Servicios:", response);
            $("#cboServicio").empty();
            $("#cboServicio").append('<option selected="selected" value="0">Seleccione un servicio</option>');
            if (response && response.length > 0) {
                response.forEach(servicio => {
                    $("#cboServicio").append('<option value="' + servicio.Id + '">' + servicio.Nombre + '</option>');
                });
            }
            // Inicializar Select2 despues de llenar el combo
            $("#cboServicio").select2({
                theme: 'bootstrap4'
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar combo de Servicios:", xhr.status, xhr.statusText, xhr.responseText, xhr);
            alert("Error al cargar los servicios.\n" + xhr.responseText);
        }
    });
}

// Funcion para ejecutar comandos (Insertar, Eliminar)
// Ahora acepta un objeto 'dataToSend' que contiene los datos necesarios para la operacion.
function EjecutarComando(Metodo, Funcion, dataToSend = null) {
    let datos = null;

    if (Metodo === "POST") {
        // Para Insertar, siempre toma los datos de los combos del formulario
        datos = ObtenerDatosServicioSede();
        if (!datos) return; // Si la validacion de ObtenerDatosServicioSede fallo
    } else if (Metodo === "DELETE") {
        // Para Eliminar, los datos ya vienen en 'dataToSend' (el objeto { Id: X })
        datos = dataToSend;
        if (!datos || !datos.Id) {
            console.error("Error: dataToSend o su propiedad Id es nula para la operacion DELETE.");
            alert("Error: Datos incompletos para la operación de eliminación.");
            return;
        }
    } else {
        console.error("Metodo HTTP no soportado: " + Metodo);
        alert("Operacion no soportada.");
        return;
    }

    let URL = BaseURL + "api/Servicio_Sede/" + Funcion; // Ajusta la ruta de tu API (sin espacio)
    console.log(`Ejecutando comando ${Metodo} a ${URL} con datos:`, datos);

    // Obtener el token de las cookies
    const token = getCookie("token"); // Asume que getCookie esta disponible globalmente

    $.ajax({
        type: Metodo,
        url: URL,
        headers: {
            'Authorization': 'Bearer ' + token // Usa el token para autenticacion
        },
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (response) {
            console.log("Respuesta exitosa de EjecutarComando:", response);
            alert("Operacion completada."); // Mensaje de exito
            ListarServiciosSede(); // Recarga la tabla despues de la operacion
            LimpiarCamposServicioSede();
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud EjecutarComando:", xhr.status, xhr.statusText, xhr.responseText, xhr);
            alert("Error al realizar la operacion.\n" + (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText || error));
        }
    });
}

// Clase para representar un objeto ServicioSede
// Ahora incluye la propiedad 'Id' que se usará para la eliminación
class ServicioSede {
    constructor(Id, IdSede, IdServicio) {
        this.Id = Id; // Este será el ID único de la base de datos
        this.IdSede = IdSede;
        this.IdServicio = IdServicio;
    }
}

// Funcion para limpiar los campos del formulario
function LimpiarCamposServicioSede() {
    $("#cboSede").val("0").trigger('change'); // Restablece el combo de sede
    $("#cboServicio").val("0").trigger('change'); // Restablece el combo de servicio
    // No usamos dvMensaje con alert()
}


