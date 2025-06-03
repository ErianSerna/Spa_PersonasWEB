var URLBase = "http://localhost:55534/"; // para el consumo de las apis

document.addEventListener("DOMContentLoaded", function () {
    // Metodos y demas
    llenarTabla();

    // Funcion para llenar la tabla Usuarios
    function llenarTabla() {
        $.ajax({
            type: "GET",
            url: URLBase + "api/Usuario/Listar",
            success: function (response) {
                console.log(response) // Depuracion
            }
        })
    }


})

//jQuery(function () {
//    //Registrar los botones para responder al evento click
//    $("#dvMenu").load("../Paginas/Menu.html");
//    LlenarTablaUsuarios();
//});
//function LlenarTablaUsuarios() {
//    let URL = URLBase + "api/Usuario/Listar";
//    LlenarTablaXServiciosAuth(URL, "#tblUsuario");
//}
//async function EjecutarComando(Metodo, Funcion) {
//    let URL = URLBase + "api/Usuario/" + Funcion;
//    const usuario = new Usuario($("#txtNombreUsuario").val(), $("#txtDocumentoUsuario").val(),$("#").val(),);
//    const rpta = await EjecutarComandoServicioAuth(Metodo, URL, empleado);
//    LlenarTablaEmpleados();
//}
//async function Consultar() {
//    let Documento = $("#txtDocumento").val();
//    let URL = URLBase + "api/Empleados/ConsultarXDocumento?Documento=" + Documento;
//    const empleado = await ConsultarServicioAuth(URL);
//    if (empleado == null || empleado == undefined) {
//        $("#dvMensaje").removeClass("alert alert-success");
//        $("#dvMensaje").addClass("alert alert-danger");
//        $("#dvMensaje").html("No se pudo realizar la consulta del empleado");
//        $("#txtNombre").val("");
//        $("#txtPrimerApellido").val("");
//        $("#txtSegundoApellido").val("");
//        $("#txtFechaNacimiento").val("");
//        $("#txtTelefono").val("");
//        $("#txtDireccion").val("");
//    }
//    else {
//        $("#dvMensaje").removeClass("alert alert-danger");
//        $("#dvMensaje").addClass("alert alert-success");
//        $("#dvMensaje").html("");
//        //Consultó el empleado
//        $("#txtNombre").val(empleado.Nombre);
//        $("#txtPrimerApellido").val(empleado.PrimerApellido);
//        $("#txtSegundoApellido").val(empleado.SegundoApellido);
//        $("#txtFechaNacimiento").val(empleado.FechaNacimiento.split('T')[0]);
//        $("#txtTelefono").val(empleado.Telefono);
//        $("#txtDireccion").val(empleado.Direccion);
//    }
//}
//class Empleado {
//    constructor(Documento, Nombre, PrimerApellido, SegundoApellido, Direccion, Telefono, FechaNacimiento) {
//        this.Documento = Documento;
//        this.Nombre = Nombre;
//        this.PrimerApellido = PrimerApellido;
//        this.SegundoApellido = SegundoApellido;
//        this.Direccion = Direccion;
//        this.Telefono = Telefono;
//        this.FechaNacimiento = FechaNacimiento;
//    }
//}