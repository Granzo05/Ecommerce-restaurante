import { Pedido } from './types'
import { descargarFactura } from './pdfs/scriptDescargaPDF';

export function cargarPedidos(idCliente: string) {
    fetch('http://localhost:8080/cliente/id/' + idCliente + "/pedidos", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let gridContainer = document.getElementById("pedidos");

            data.forEach((pedido: Pedido) => {
                let gridItem = document.createElement("div");
                gridItem.className = "grid-item";

                let tipoEnvio = document.createElement("h3");
                tipoEnvio.textContent = pedido.tipoEnvio;
                gridItem.appendChild(tipoEnvio);

                // Si hubo envido el domicilio deberia estar, si fue retiro en tienda no
                if (pedido.domicilio != null) {
                    let domicilio = document.createElement("h3");
                    domicilio.textContent = pedido.domicilio;
                    gridItem.appendChild(domicilio);
                }

                pedido.detalles.forEach(detalle => {
                    let menu = document.createElement("p");
                    menu.textContent = detalle.menu;
                    gridItem.appendChild(menu);

                    let cantidad = document.createElement("p");
                    cantidad.textContent = detalle.cantidad;
                    gridItem.appendChild(cantidad);
                });

                let fecha = document.createElement("h2");
                fecha.textContent = pedido.detalles[0].fechaPedido;
                gridItem.appendChild(fecha);

                let facturaButton = document.createElement("button");
                facturaButton.textContent = "DESCARGAR FACTURA";

                facturaButton.onclick = function () {
                    if (fecha.textContent) {
                        descargarFactura(pedido.id, fecha.textContent);
                    }
                }

                if (gridContainer) {
                    gridContainer.appendChild(gridItem);
                }
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
