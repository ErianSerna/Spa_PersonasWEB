var URLBase = "http://spapersonas2025.runasp.net/"; // para el consumo de las apis

document.addEventListener("DOMContentLoaded", function () {
    // Metodos y demas
    llenarTabla();

    // Funcion para llenar la tabla Usuarios
    function llenarTabla() {
        //const token = localStorage.getItem('token'); // o sessionStorage
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Usuario/Listar",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            success: function (response) {
                console.log(response); // Depuración
                let htmlContent = "";
                let tablaBody = document.getElementById("tblUsuarioBody");
                response.forEach(u => {
                    htmlContent += `
                    <tr>
                        <td>${u.Id}</td>
                        <td>${u.Nombre}</td>
                        <td class="tdcedula">${u.Cedula}</td>
                        <td>${u.Telefono}</td>
                        <td>${u.Correo_electronico}</td>
                        <td>${u.IdTipoUsuario}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-primary w-100 btnActualizar" data-id=${u.Id}>Actualizar</button>
                            <button type="button" class="btn btn-sm btn-danger w-100 btnEliminar" data-id=${u.Id}>Eliminar</button>
                        </td>
                    </tr>
                `;
                    console.log("Nombre usuario: ", u.Nombre);
                });

                tablaBody.innerHTML = htmlContent;
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud:", xhr.responseText);
            }
        });
    }

    // Metodo para insertar un usuario a la bd
    function insertarUsuario() {
        // Obtener los datos del formulario
        let nombreUser = ($("#txtNombreUsuario").val() || "").trim();
        let documento = ($("#txtDocumentoUsuario").val() || "").trim();
        let telefono = ($("#txtTelefonoUsuario").val() || "").trim();
        let correo = ($("#txtCorreoUsuario").val() || "").trim();
        let tipoUser = ($("#txtTipoUsuario").val() || "").trim();
        const token2 = getCookie("token");

        if (!nombreUser || !documento || !telefono || !correo || !tipoUser) {
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
            url: URLBase + "api/Usuario/Insertar",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Nombre": nombreUser,
                "Cedula": documento,
                "Telefono": telefono,
                "Correo_electronico": correo,
                "IdTipoUsuario": tipoUser
            },
            success: function (response) {
                console.log(response);
                Swal.fire({
                    icon: "success",
                    title: "Inserción Exitosa",
                    text: "Se ha insertado correctamente el usuario",
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

    // Metodo para actualizar un usuario
    function actualizarUsuario(id) {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Usuario/ConsultarXId",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Id": id
            },
            success: function (response) {
                console.log(response);
                $("#txtNombreUsuario").val(response.Nombre);
                $("#txtDocumentoUsuario").val(response.Cedula) ;
                $("#txtTelefonoUsuario").val(response.Telefono);
                $("#txtCorreoUsuario").val(response.Correo_electronico) ;
                $("#txtTipoUsuario").val(response.IdTipoUsuario);
                $("#txtId").val(response.Id);
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
            actualizarUsuario(id);

        }
    });

    function eliminarUsuario(cedula) {
        const token2 = getCookie("token");
        $.ajax({
            type: "DELETE",
            url: URLBase + "api/Usuario/Eliminar",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Cedula": cedula
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Eliminación Exitosa",
                    text: "Se ha eliminado correctamente el usuario",
                    timer: 2000
                });

                llenarTabla();
            }
        })
    }

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btnEliminar")) { // Eliminar
            e.preventDefault();

            Swal.fire({
                title: "¿Está seguro de eliminar el usuario?",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                denyButtonText: `Cancelar`
            }).then((result) => {
                if (result.isConfirmed) {
                    //const id = e.target.getAttribute("data-id");
                    var fila = $(e.target).closest("tr"); // Obtener la fila <tr> más cercana al botón presionado
                    var cedula = fila.find(".tdcedula").text(); // Buscar el td con la clase tdcedula dentro de esa fila
                    eliminarUsuario(cedula);
                } 
            });
        }
    });

    // Metodo para cuando se va a confirmar la actualizacion del usuario
    function confirmarActualizacionUsuario() {
        // Obtener los datos del formulario
        let nombreUser = ($("#txtNombreUsuario").val() || "").trim();
        let documento = ($("#txtDocumentoUsuario").val() || "").trim();
        let telefono = ($("#txtTelefonoUsuario").val() || "").trim();
        let correo = ($("#txtCorreoUsuario").val() || "").trim();
        let tipoUser = ($("#txtTipoUsuario").val() || "").trim();
        let id = ($("#txtId").val() || "").trim();
        const token2 = getCookie("token");

        if (!nombreUser || !documento || !telefono || !correo || !tipoUser || !id) {
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
            url: URLBase + "api/Usuario/Actualizar",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Id": id,
                "Nombre": nombreUser,
                "Cedula": documento,
                "Telefono": telefono,
                "Correo_electronico": correo,
                "IdTipoUsuario": tipoUser
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
                    text: 'El usuario se actualizó con éxito.',
                    confirmButtonText: 'Aceptar'
                });
                $("#txtNombreUsuario").val("");
                $("#txtDocumentoUsuario").val("");
                $("#txtTelefonoUsuario").val("");
                $("#txtCorreoUsuario").val("");
                $("#txtTipoUsuario").val("");
                $("#txtId").val("");
                llenarTabla();
            }
            
        })
    }

    // Evento para detectar click en confirmar al querer actualizar el usuario
    document.getElementById("btnConfirmar").addEventListener("click", function (e) {
        e.preventDefault();
        confirmarActualizacionUsuario();
    })

    // Evento para detectar click en cancelar al querer actualizar el usuario
    document.getElementById("btnCancelar").addEventListener("click", function (e) {
        e.preventDefault();
        $("#txtNombreUsuario").val("");
        $("#txtDocumentoUsuario").val("");
        $("#txtTelefonoUsuario").val("");
        $("#txtCorreoUsuario").val("");
        $("#txtTipoUsuario").val("");
        $("#txtId").val("");
    })

    // Metodo para consultarPorCedula
    function consultarPorCedula(cedula) {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Usuario/ConsultarXCedula",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Cedula": cedula
            },
            success: function (response) {
                console.log(response);
                if (response && typeof response === "object") {
                    let tablaBody = document.getElementById("tblUsuarioBody");
                    let htmlContent = `
                    <tr>
                        <td>${response.Id}</td>
                        <td>${response.Nombre}</td>
                        <td class="tdcedula">${response.Cedula}</td>
                        <td>${response.Telefono}</td>
                        <td>${response.Correo_electronico}</td>
                        <td>${response.IdTipoUsuario}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-primary w-100 btnActualizar" data-id=${response.Id}>Actualizar</button>
                            <button type="button" class="btn btn-sm btn-danger w-100 btnEliminar" data-id=${response.Id}>Eliminar</button>
                        </td>
                    </tr>
                    `;
                    tablaBody.innerHTML = htmlContent;

                } else {
                    Swal.fire({
                        icon: "warning",
                        toast: true,
                        position: "top-end",
                        title: "Usuario no encontrado",
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
            consultarPorCedula(textoBuscar);
        } else {
            llenarTabla();
        }
    })

})