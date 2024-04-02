import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { DetallePedido } from '../../types/Detalles_pedido';
import { Menu } from '../../types/Menu';
import { Pedido } from '../../types/Pedido';

const PedidosAceptados = () => {
    EmpleadoService.checkUser('empleado');

    PedidoService.getPedidos('aceptados').
        then(data => {
            let contenedorPrincipal = document.getElementById("pedidos");
            let menus: Menu[];

            data.forEach((pedido: Pedido) => {
                let contenedor = document.createElement("div");
                contenedor.className = "grid-item";

                let tipoEnvio = document.createElement("h3");
                tipoEnvio.textContent = pedido.tipoEnvio;
                contenedor.appendChild(tipoEnvio);

                // Si hubo envido el domicilio deberia estar, si fue retiro en tienda no
                if (pedido.cliente.domicilio != null) {
                    let domicilio = document.createElement("h3");
                    domicilio.textContent = pedido.cliente.domicilio;
                    contenedor.appendChild(domicilio);
                }

                pedido.detalles.forEach((detalle: DetallePedido) => {
                    let menu = document.createElement("p");
                    menu.textContent = detalle.menu.nombre;
                    contenedor.appendChild(menu);
                    // Obtengo todos los menus para validar mas adelante
                    menus.push(detalle.menu)

                    let cantidad = document.createElement("p");
                    cantidad.textContent = detalle.cantidad.toString();
                    contenedor.appendChild(cantidad);
                });
                contenedorPrincipal?.appendChild(contenedor);
            })
        });

    return (
        
        <div>
            <h1>Tus Pedidos Aceptados</h1>
            <div id="pedidos"></div>
        </div>
    )
}

export default PedidosAceptados
