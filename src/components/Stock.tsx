import { EmpleadoService } from "../services/EmpleadoService";
import { stockService } from "../services/StockService";

const Stock = () => {
    EmpleadoService.checkUser('empleado');

    stockService.getStock()
        .then(data => {
            let contenedorPrincipal = document.getElementById("stock");

            data.forEach(stock => {
                let contenedor = document.createElement("div");
                contenedor.className = "grid-item";

                let nombre = document.createElement("h3");
                nombre.textContent = stock.ingrediente.nombre;
                contenedor.appendChild(nombre);

                let cantidad = document.createElement("h3");
                cantidad.textContent = (stock.cantidad).toString();
                contenedor.appendChild(cantidad);

                let medida = document.createElement("h3");
                medida.textContent = stock.medida;
                contenedor.appendChild(medida);

                let fecha = document.createElement("h3");
                fecha.textContent = stock.fechaIngreso.getTime().toString();
                contenedor.appendChild(fecha);
                
                contenedorPrincipal?.appendChild(contenedor);
            })
        });

    return (
        <div >
            <h1>Stock</h1>
            <div id="stock"></div>
        </div>
    )
}

export default Stock
