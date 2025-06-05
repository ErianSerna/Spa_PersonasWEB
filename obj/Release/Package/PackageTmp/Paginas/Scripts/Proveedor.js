var URLBase = "http://spapersonas2025.runasp.net/"; // para el consumo de las apis

document.addEventListener("DOMContentLoaded", function () {
    // Metodos y demas
    llenarTabla();

    // Funcion para llenar la tabla Usuarios
    function llenarTabla() {
        //const token = localStorage.getItem('token'); // o sessionStorage
        const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkVzZXJuYTI2IiwibmJmIjoxNzQ4OTg4Mjk2LCJleHAiOjE3NDkwMzE0OTYsImlhdCI6MTc0ODk4ODI5NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0NDMyMyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQzMjMifQ._eSRcyd3oX7amm6aZ_nop48Ua_InGkksSh9yrFs3fow"
        $.ajax({
            type: "GET",
            url: URLBase + "api/Proveedor/ConsultarTodos",
            headers: {
                'Authorization': 'Bearer ' + token2
            },
            success: function (response) {
                console.log(response); // Depuración
                let htmlContent = "";
                let tablaBody = document.getElementById("tblProveedorBody");
                response.forEach(p => {
                    htmlContent += `
                    <tr>
                        <td>${p.Nombre}</td>
                        <td>${p.Telefono}</td>
                        <td>${p.Correo_electronico}</td>
                        <td>${p.Nit}</td>
                        <td>${p.Direccion}</td>
                    </tr>
                `;
                    console.log("Nombre proveedor: ", p.Nombre);
                });

                tablaBody.innerHTML = htmlContent;
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud:", xhr.responseText);
            }
        });
    }


})