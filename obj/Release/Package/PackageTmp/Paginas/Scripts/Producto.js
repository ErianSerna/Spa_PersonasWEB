var URLBase = "http://spapersonas2025.runasp.net/"; // para el consumo de las apis

document.addEventListener("DOMContentLoaded", function () {
   // Metodos y demas
    llenarTabla();
    LlenarSelectProvedor();

   // Funcion para llenar la tabla Usuarios
   function llenarTabla() {
       //const token = localStorage.getItem('token'); // o sessionStorage
       const token2 = getCookie("token");
       $.ajax({
           type: "GET",
           url: URLBase + "api/Producto/ConsultarTodos",
           headers: {
               'Authorization': 'Bearer ' + token2
           },
           success: function (response) {
               console.log(response); // Depuración
               let htmlContent = "";
               let tablaBody = document.getElementById("tblProductoBody");
               response.forEach(p => {
                   htmlContent += `
                   <tr>
                       <td>${p.Id}</td>
                       <td>${p.Nombre}</td>
                       <td>${p.Precio}</td>
                       <td>${p.Descripcion}</td>
                       <td>${p.IdProveedor}</td>
                       <td>${p.IdTipoProducto}</td>
                       <td>
                            <button type="button" class="btn btn-sm btn-primary w-100 btnActualizar" data-id=${p.Id}>Actualizar</button>
                            <button type="button" class="btn btn-sm btn-danger w-100 btnEliminar" data-id=${p.Id}>Eliminar</button>
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
    //metodo para cargar las opciones de Proveedor
    function LlenarSelectProvedor() {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Proveedor/ConsultarTodos",
            headers: { 'Authorization': 'Bearer ' + token2 },
            success: function (data) {
                let ddl = $("#txtNombreProveedor");
                ddl.empty();
                ddl.append('<option value="">Seleccione un proveedor</option>');
                data.forEach(p => {
                    ddl.append(`<option value="${p.Id}">${p.Nombre}</option>`);
                });
            },
            error: function (xhr) {
                console.error("Error al cargar proveedores:", xhr.responseText);
            }
        });
    }

    //metodos para cuando se le de click en el insertar
    $('#bntInsertar').click(function () {
        const datos = ObtenerDatosFormulario();
        if (!datos) { // Si datos es false, hay campos vacíos
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Todos los campos deben llenarse",
                timer: 2000
            });
            return;
        } else {
            const token2 = getCookie("token");
            $.ajax({
                type: "POST",
                url: URLBase + "api/Producto/Insertar",
                contentType: "application/json",
                data: JSON.stringify(datos),
                headers: {
                    'Authorization': 'Bearer ' + token2
                },
                success: function (response) {
                    console.log(response);
                    Swal.fire({
                        icon: "success",
                        title: "Inserción Exitosa",
                        text: "Se ha insertado correctamente el producto",
                        timer: 2000
                    });
                    llenarTabla();
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                    alert("Error al insertar producto.");
                }
            });
        }
    });

    function ObtenerDatosFormulario() {
        let Id = $("#txtId").val();
        let Nombre = $("#txtNombreProducto").val();
        let Precio = $("#txtPrecioProducto").val();
        let Descripcion = $("#txtDescripcionProducto").val();
        let IdProveedor = $("#txtNombreProveedor").val();
        let IdTipoProducto = $("#txtTipoProducto").val();

        // Valida que todos los campos estén llenos (excepto Id, que puede ser 0)
        if (!Nombre || !Precio || !Descripcion || !IdProveedor || !IdTipoProducto) {
            return false;
        } else {
            return {
                Id: Id,
                Nombre: Nombre,
                Precio: Precio,
                Descripcion: Descripcion,
                IdProveedor: IdProveedor,
                IdTipoProducto: IdTipoProducto
            };
        }
    }


    //metodo para consultar 
    $('#btnConsultar').click(function () {
        const NombreProduc = $('#txtInputConsultar').val();
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Producto/ConsultarXNombre?NombreProd=" + NombreProduc,
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            success: function (producto) {
                if (!producto) {
                    document.getElementById("tblProductoBody").innerHTML = "";
                    return;
                }
                console.log(producto);
                var productos = Array.isArray(producto) ? producto : [producto];

                let htmlContent = "";
                        productos.forEach(p => {
                            htmlContent += `
                   <tr>
                       <td>${p.Id}</td>
                       <td>${p.Nombre}</td>
                       <td>${p.Precio}</td>
                       <td>${p.Descripcion}</td>
                       <td>${p.IdProveedor}</td>
                       <td>${p.IdTipoProducto}</td>
                       <td>
                            <button type="button" class="btn btn-sm btn-primary w-100 btnActualizar" data-id=${p.Id}>Actualizar</button>
                            <button type="button" class="btn btn-sm btn-danger w-100 btnEliminar" data-id=${p.Id}>Eliminar</button>
                        </td>
                   </tr>
       `;
                });
                document.getElementById("tblProductoBody").innerHTML = htmlContent;
            },

            error: function (xhr) {
                console.error(xhr.responseText);
                alert("Error al consultar producto.");
            }
        });
    });

    // Metodo para actualizar un producto
    function actualizarProducto(id) {
        const token2 = getCookie("token");
        $.ajax({
            type: "GET",
            url: URLBase + "api/Producto/ConsultarXId",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "idProd": id
            },
            success: function (response) {
                console.log(response);
                $("#txtNombreProducto").val(response.Nombre);
                $("#txtPrecioProducto").val(response.Precio);
                $("#txtDescripcionProducto").val(response.Descripcion);
                $("#txtNombreProveedor").val(response.IdProveedor);
                $("#txtTipoProducto").val(response.IdTipoProducto);
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
            actualizarProducto(id);
        }
    });

    // Evento para detectar click en confirmar al querer actualizar el usuario
    document.getElementById("btnConfirmar").addEventListener("click", function (e) {
        e.preventDefault();
        confirmarActualizacionProducto();
    });

    // Metodo para cuando se va a confirmar la actualizacion del producto
    function confirmarActualizacionProducto() {
        // Obtener los datos del formulario
        let Id = $("#txtId").val();
        let Nombre = $("#txtNombreProducto").val();
        let Precio = $("#txtPrecioProducto").val();
        let Descripcion = $("#txtDescripcionProducto").val();
        let IdProveedor = $("#txtNombreProveedor").val();
        let IdTipoProducto = $("#txtTipoProducto").val();
        const token2 = getCookie("token");

        if (!Nombre || !Precio || !Descripcion || !IdProveedor || !IdTipoProducto) {
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
            url: URLBase + "api/Producto/Actualizar", 
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            contentType: "application/json", 
            data: JSON.stringify({
                Id: Id,
                Nombre: Nombre,
                Precio: Precio,
                Descripcion: Descripcion,
                IdProveedor: IdProveedor,
                IdTipoProducto: IdTipoProducto
            }),
            success: function (response) {
                // Reactivar o desactivar los botones según sea el caso
                $("#btnInsertar").removeAttr("disabled");
                $("#btnConsultar").removeAttr("disabled",true);
                $("#btnConfirmar").prop("disabled", true);
                $("#btnCancelar").prop("disabled", true);

                Swal.fire({
                    icon: 'success',
                    title: '¡Producto actualizado!',
                    text: 'El producto se actualizó con éxito.',
                    confirmButtonText: 'Aceptar'
                });
                $("#txtNombreProducto").val("");
                $("#txtPrecioProducto").val("");
                $("#txtDescripcionProducto").val("");
                $("#txtNombreProveedor").val("");
                $("#txtTipoProducto").val("");
                $("#txtId").val("");
                llenarTabla();
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar el producto.',
                    confirmButtonText: 'Aceptar'
                });
                console.error(xhr.responseText);
            }
        });
    }

    //funcion para eliminar usuario
    function eliminarUsuario(Id) {
        const token2 = getCookie("token");
        $.ajax({
            type: "DELETE",
            url: URLBase + "api/Producto/Eliminar",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            data: {
                "Id": Id
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
                denyButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    //const id = e.target.getAttribute("data-id");
                    var fila = $(e.target).closest("tr"); // Obtener la fila <tr> más cercana al botón presionado
                    var Id = fila.find("td:eq(0)").text(); // Buscar el td con la clase tdcedula dentro de esa fila
                    eliminarUsuario(Id);
                }
            });
        }
    });

    // Evento para detectar click en cancelar al querer actualizar el usuario
    document.getElementById("btnCancelar").addEventListener("click", function (e) {
        e.preventDefault();
        $("#txtNombreProducto").val("");
        $("#txtPrecioProducto").val("");
        $("#txtDescripcionProducto").val("");
        $("#txtNombreProveedor").val("");
        $("#txtTipoProducto").val("");
        $("#txtId").val("");
    })

});
