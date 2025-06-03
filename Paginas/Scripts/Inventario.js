var URLBase = "http://localhost:55534/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaInventario();
    RegistrarEventos();
});

function RegistrarEventos() {
    $("#btnInsertar").click(function (e) {
        e.preventDefault();
        InsertarInventario();
    });

    $("#btnActualizar").click(function (e) {
        e.preventDefault();
        ActualizarInventario();
    });

    $("#btnEliminar").click(function (e) {
        e.preventDefault();
        EliminarInventario();
    });

    $("#btnConsultar").click(function (e) {
        e.preventDefault();
        LlenarTablaInventario();
    });
}

function LlenarTablaInventario() {
    let URL = URLBase + "api/Inventario/ConsultarTodos";

    $.getJSON(URL, function (data) {
        $("#tblInventario tbody").empty();

        data.forEach(function (inv) {
            let fila = `
                <tr>
                    <td><button class="btn btn-warning btn-sm" onclick='CargarDatos(${JSON.stringify(JSON.stringify(inv))})'>Editar</button></td>
                    <td>${inv.Id}</td>
                    <td>${inv.Stock}</td>
                    <td>${inv.UltimoRestock}</td>
                    <td>${inv.IdProducto}</td>
                    <td>${inv.IdSede}</td>
                </tr>`;
            $("#tblInventario tbody").append(fila);
        });
    });
}

function CargarDatos(jsonString) {
    let inv = JSON.parse(JSON.parse(jsonString));
    $("#txtIdInventario").val(inv.Id);
    $("#txtStock").val(inv.Stock);
    $("#txtUltimoRestock").val(inv.UltimoRestock);
    $("#ddlProducto").val(inv.IdProducto);
    $("#ddlSede").val(inv.IdSede);
}

function InsertarInventario() {
    let inventario = ObtenerDatosFormulario();

    $.ajax({
        type: "POST",
        url: URLBase + "api/Inventario/Insertar",
        data: JSON.stringify(inventario),
        contentType: "application/json",
        success: function () {
            alert("Inventario insertado con éxito");
            LlenarTablaInventario();
            LimpiarFormulario();
        }
    });
}

function ActualizarInventario() {
    let inventario = ObtenerDatosFormulario();

    $.ajax({
        type: "PUT",
        url: URLBase + "api/Inventario/Actualizar",
        data: JSON.stringify(inventario),
        contentType: "application/json",
        success: function () {
            alert("Inventario actualizado con éxito");
            LlenarTablaInventario();
            LimpiarFormulario();
        }
    });
}

function EliminarInventario() {
    let id = $("#txtIdInventario").val();
    if (!id) {
        alert("Selecciona un registro para eliminar");
        return;
    }

    $.ajax({
        type: "DELETE",
        url: URLBase + "api/Inventario/Eliminar/" + id,
        success: function () {
            alert("Inventario eliminado con éxito");
            LlenarTablaInventario();
            LimpiarFormulario();
        }
    });
}

function ObtenerDatosFormulario() {
    return {
        Id: $("#txtIdInventario").val() || 0,
        Stock: $("#txtStock").val(),
        UltimoRestock: $("#txtUltimoRestock").val(),
        IdProducto: $("#ddlProducto").val(),
        IdSede: $("#ddlSede").val()
    };
}

function LimpiarFormulario() {
    $("#txtIdInventario").val('');
    $("#txtStock").val('');
    $("#txtUltimoRestock").val('');
    $("#ddlProducto").val('');
    $("#ddlSede").val('');
}


