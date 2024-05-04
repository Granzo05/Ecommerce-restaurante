import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';


const PedidosEntrantes = () => {
    const [pedidosEntrantes, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await EmpleadoService.checkUser();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        buscarPedidos();

    }, []);

    const buscarPedidos = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.COCINADOS)
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function handleEntregarPedido(pedido: Pedido) {
        // Modificar estado de pantalla del cliente donde vea que el negocio acepto el pedido, podria
        // usar la condicional de estado 'aceptado' para ir variando las imagenes que se le muestran al cliente en su pedido

        let response = await PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.ENTREGADOS);
        alert(await response);
        buscarPedidos();
    }

    async function handleCancelarPedido(pedido: Pedido) {
        let response = await PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.RECHAZADOS);
        alert(await response);
        buscarPedidos();
    }

    return (

        <div className="opciones-pantallas">
            <h1>Pedidos listos</h1>
            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Tipo de envío</th>
                            <th>Menu</th>
                            <th>Entregar</th>
                            <th>Cancelar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosEntrantes.map(pedido => (
                            <tr key={pedido.id}>
                                <td>
                                    <div>
                                        <p>{pedido.cliente?.nombre}</p>
                                        <p>{pedido.domicilioEnvio?.calle} {pedido.domicilioEnvio?.numero}, {pedido.domicilioEnvio?.localidad?.nombre}</p>
                                        <p>{pedido.cliente?.telefono}</p>
                                        <p>{pedido.cliente?.email}</p>
                                    </div>
                                </td>
                                <td>{pedido.tipoEnvio}</td>
                                <td>
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.articuloMenu?.nombre} - {detalle.cantidad}</p>
                                        </div>
                                    ))}
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.articuloMenu?.nombre} - {detalle.cantidad}</p>
                                        </div>
                                    ))}
                                </td>
                                <td><button onClick={() => handleEntregarPedido(pedido)}>Entregar</button></td>
                                <td><button onClick={() => handleCancelarPedido(pedido)}>Cancelar</button></td>
                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default PedidosEntrantes
