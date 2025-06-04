var URLBase = "http://spapersonas2025.runasp.net/";

document.addEventListener("DOMContentLoaded", function () {

    LlenarDDLProductos();

    LlenarDDLSedes();

    llenarTabla();

    // ----------------- LISTAR -----------------
    function llenarTabla() {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Inventario/ConsultarTodos",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            success: function (response) {
                let htmlContent = "";
                let tablaBody = document.getElementById("tblInventarioBody");
                response.forEach(inv => {
                    htmlContent += `
                    <tr>
                        <td>${inv.Id}</td>
                        <td>${inv.Stock}</td>
                        <td>${inv.UltimoRestock}</td>
                        <td>${inv.IdProducto}</td>
                        <td>${inv.IdSede}</td>
                        <td>
                            <button class="btn btn-sm btn-primary w-100 btnActualizar" data-id=${inv.Id}>Actualizar</button>
                            <button class="btn btn-sm btn-danger w-100 btnEliminar" data-id=${inv.Id}>Eliminar</button>
                        </td>
                    </tr>
                `;
                });

                tablaBody.innerHTML = htmlContent;
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud:", xhr.responseText);
            }
        });
    }

    // ----------------- LISTAR -----------------

    // ----------------- INSERTAR -----------------

    // Metodo para insertar un inventario a la bd
    function insertarUsuario() {
        // Obtener los datos del formulario
        let stock = ($("#txtStock").val() || "").trim();
        let ultimorestock = ($("#txtUltimoRestock").val() || "").trim();
        let idProducto = ($("#ddlProducto").val() || "").trim();
        let idSede = ($("#ddlSede").val() || "").trim();
        const token2 = getCookie("token");

        if (!stock || !ultimorestock || !idProducto || !idSede) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Los campos deben llenarse",
                timer: 2000
            });
            return;
        }

        $.ajax({
            type: "POST",
            url: URLBase + "api/Inventario/Insertar",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Stock": stock,
                "UltimoRestock": ultimorestock,
                "IdProducto": idProducto,
                "IdSede": idSede
            },

            success: function (response) {
                console.log(response);
                Swal.fire({
                    icon: "success",
                    title: "Inserción Exitosa",
                    text: "Se ha insertado correctamente el inventario",
                    timer: 2000
                });

                llenarTabla();
            }
        })
    }

    document.getElementById("btnInsertar").addEventListener("click", function (e) {
        e.preventDefault();
        insertarUsuario();
    })


    // ----------------- FIN INSERTAR -----------------


    // ----------------- ACTUALIZAR -----------------

    // Metodo para actualizar un usuario
    function actualizarInventario(id) {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Inventario/ConsultarXId",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "idInventario": id
            },
            success: function (response) {
                console.log(response);
                $("#txtIdInventario").val(response.Id);
                $("#txtStock").val(response.Stock);
                $("#txtUltimoRestock").val(response.UltimoRestock);
                $("#ddlProducto").val(response.IdProducto);
                $("#ddlSede").val(response.IdSede);
            }
        })
    }

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btnActualizar")) { // Actualizar
            e.preventDefault();
            const id = e.target.getAttribute("data-id");
            console.log("Actualizar ID:", id);
            $("#btnInsertar").prop("disabled", true);
            $("#btnConsultar").prop("disabled", true);
            $("#btnConfirmar").removeAttr("disabled");
            $("#btnCancelar").removeAttr("disabled");
            actualizarInventario(id);

        }
    });


    // Metodo para cuando se va a confirmar la actualizacion del usuario
    function confirmarActualizacionInventario() {
        // Obtener los datos del formulario
        let stock = ($("#txtStock").val() || "").trim();
        let ultimorestock = ($("#txtUltimoRestock").val() || "").trim();
        let idProducto = ($("#ddlProducto").val() || "").trim();
        let idSede = ($("#ddlSede").val() || "").trim();
        let id = ($("#txtIdInventario").val() || "").trim();
        const token2 = getCookie("token");

        if (!stock || !ultimorestock || !idProducto || !idSede || !id) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Los campos deben llenarse",
                timer: 2000
            });
            return;
        }
        $.ajax({
            type: "PUT",
            url: URLBase + "api/Inventario/Actualizar",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Id": id,
                "Stock": stock,
                "UltimoRestock": ultimorestock,
                "IdProducto": idProducto,
                "IdSede": idSede
            },
            success: function (response) {
                console.log(response);
                // Reactivar o desactivar los botones segun sea el caso
                $("#btnInsertar").removeAttr("disabled");
                $("#btnConsultar").removeAttr("disabled");
                $("#btnConfirmar").prop("disabled", true);
                $("#btnCancelar").prop("disabled", true);

                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario actualizado!',
                    text: 'El inventario se actualizó con éxito.',
                    confirmButtonText: 'Aceptar'
                });

                $("#txtIdInventario").val("");
                $("#txtStock").val("");
                $("#txtUltimoRestock").val("");
                $("#ddlProducto").val("");
                $("#ddlSede").val("");
                $("#txtId").val("");
                llenarTabla();

            }

        })
    }

    // Evento para detectar click en confirmar al querer actualizar el usuario
    document.getElementById("btnConfirmar").addEventListener("click", function (e) {
        e.preventDefault();
        confirmarActualizacionInventario();
    })

    // Evento para detectar click en cancelar al querer actualizar el usuario
    document.getElementById("btnCancelar").addEventListener("click", function (e) {
        e.preventDefault();
        $("#txtIdInventario").val("");
        $("#txtStock").val("");
        $("#txtUltimoRestock").val("");
        $("#ddlProducto").val("");
        $("#ddlSede").val("");
    });


    // ----------------- FIN ACTUALIZAR -----------------


    // ----------------- ELIMINAR -----------------

    function eliminarInventario(id) {
        const token2 = getCookie("token");
        $.ajax({
            type: "DELETE",
            url: URLBase + "api/Inventario/Eliminar",
            headers: {
                'Authorization': 'Bearer ' + token2,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ Id: id }),
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Eliminación Exitosa",
                    text: "Se ha eliminado correctamente el inventario",
                    timer: 2000
                });
                llenarTabla();
            }
        });

    }

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btnEliminar")) { // Eliminar
            e.preventDefault();

            Swal.fire({
                title: "¿Está seguro de eliminar el inventario?",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                denyButtonText: `Cancelar`
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = e.target.getAttribute("data-id");
                    eliminarInventario(id);
                }
            });
        }

    });

    // ----------------- FIN ELIMINAR -----------------

    // ----------------- CONSULTAR --------------------

    // Metodo para consultarPorId
    function consultarPorId(id) {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Inventario/ConsultarXId",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "idInventario": id
            },
            success: function (response) {
                console.log(response);
                if (response && typeof response === "object") {
                    let htmlContent = "";
                    let tablaBody = document.getElementById("tblInventarioBody");
                    htmlContent += `
                    <tr>
                        <td>${response.Id}</td>
                        <td>${response.Stock}</td>
                        <td>${response.UltimoRestock}</td>
                        <td>${response.IdProducto}</td>
                        <td>${response.IdSede}</td>
                        <td>
                            <button class="btn btn-sm btn-primary w-100 btnActualizar" data-id=${response.Id}>Actualizar</button>
                            <button class="btn btn-sm btn-danger w-100 btnEliminar" data-id=${response.Id}>Eliminar</button>
                        </td>
                    </tr>
                `;

                    tablaBody.innerHTML = htmlContent;

                } else {
                    Swal.fire({
                        icon: "warning",
                        toast: true,
                        position: "top-end",
                        title: "Inventario no encontrado",
                        timer: 2000
                    });
                }

            }
        })
    }


    // Evento que detecta cuando sea desea consultar por cedula
    document.getElementById("btnConsultar").addEventListener("click", function (e) {
        e.preventDefault();
        let textoBuscar = ($("#txtBuscar").val() || "").trim();

        console.log(textoBuscar);
        if (textoBuscar) {
            consultarPorId(textoBuscar);
        } else {
            llenarTabla();
        }
    })

    //-------------- FIN CONSULTAR -----------------


    //--------------------------------------------------

    function LlenarDDLProductos() {
        const token2 = getCookie("token");

        $.ajax({
            type: "GET",
            url: URLBase + "api/Producto/ConsultarTodos",
            headers: { 'Authorization': 'Bearer ' + token2 },
            success: function (data) {
                let ddl = $("#ddlProducto");
                ddl.empty();
                ddl.append('<option value="">Seleccione un producto</option>');
                data.forEach(p => {
                    ddl.append(`<option value="${p.Id}">${p.Nombre}</option>`);
                });
            },
            error: function (xhr) {
                console.error("Error al cargar productos:", xhr.responseText);
            }
        });
    }

    function LlenarDDLSedes() {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Sede/ConsultarTodos",
            headers: { 'Authorization': 'Bearer ' + token2 },
            success: function (data) {
                let ddl = $("#ddlSede");
                ddl.empty();
                ddl.append('<option value="">Seleccione una sede</option>');
                data.forEach(s => {
                    ddl.append(`<option value="${s.Id}">${s.Nombre}</option>`);
                });
            },
            error: function (xhr) {
                console.error("Error al cargar sedes:", xhr.responseText);
            }
        });
    }
});