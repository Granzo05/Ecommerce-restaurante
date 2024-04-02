import { EmpleadoService } from "../../services/EmpleadoService";

const Empleado = () => {
    EmpleadoService.checkUser('negocio');

    EmpleadoService.getEmpleados()
        .then(data => {
            let contenedorPrincipal = document.getElementById("empleados");

            data.forEach(empleado => {
                let contenedor = document.createElement("div");
                contenedor.className = "grid-item";

                let nombre = document.createElement("h3");
                nombre.textContent = empleado.nombre;
                contenedor.appendChild(nombre);

                let email = document.createElement("h3");
                email.textContent = empleado.email;
                contenedor.appendChild(email);

                let cuit = document.createElement("h3");
                cuit.textContent = (empleado.cuit).toString();
                contenedor.appendChild(cuit);

                let telefono = document.createElement("h3");
                telefono.textContent = empleado.telefono.toString();
                contenedor.appendChild(telefono);

                contenedorPrincipal?.appendChild(contenedor);
            })
        });

    return (
        <div >
            <h1>Empleados</h1>
            <div id="empleados"></div>
        </div>
    )
}

export default Empleado
