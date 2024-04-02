import { EmpleadoService } from "../../services/EmpleadoService";
import { MenuService } from "../../services/MenuService";

const Menus = () => {
    EmpleadoService.checkUser('negocio');

    MenuService.getMenus()
        .then(data => {
            let contenedorPrincipal = document.getElementById("menus");

            data.forEach(menu => {
                let contenedor = document.createElement("div");
                contenedor.className = "grid-item";

                let file = document.createElement("h3");
                file.textContent = menu.imagen64;
                contenedor.appendChild(file);

                let nombre = document.createElement("h3");
                nombre.textContent = menu.nombre;
                contenedor.appendChild(nombre);

                let comensales = document.createElement("h3");
                comensales.textContent = (menu.comensales).toString();
                contenedor.appendChild(comensales);

                let descripcion = document.createElement("h3");
                descripcion.textContent = menu.descripcion;
                contenedor.appendChild(descripcion);

                menu.ingredientes.forEach(ingrediente => {
                    let ingredienteDiv = document.createElement("h3");

                    let ingredienteNombre = document.createElement("h4");
                    ingredienteNombre.textContent = ingrediente.nombre;

                    ingredienteDiv.appendChild(ingredienteNombre);


                    let ingredienteCantidad = document.createElement("h4");
                    ingredienteCantidad.textContent = (ingrediente.cantidad).toString();

                    ingredienteDiv.appendChild(ingredienteCantidad);
                });

                let precio = document.createElement("h3");
                precio.textContent = (menu.precio).toString();
                contenedor.appendChild(precio);


                contenedorPrincipal?.appendChild(contenedor);
            })
        });

    return (
        <div >
            <h1>Menus</h1>
            <div id="menus"></div>
        </div>
    )
}

export default Menus
