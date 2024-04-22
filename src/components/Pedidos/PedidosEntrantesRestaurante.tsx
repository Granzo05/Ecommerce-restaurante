import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedido';
import '../../styles/pedidos.css';


const PedidosEntrantes = () => {
    EmpleadoService.checkUser('negocio');

    const [pedidosEntrantes, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await EmpleadoService.checkUser('negocio');
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        PedidoService.getPedidos('entrantes')
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    function handleAceptarPedido(idPedido: number) {
        // Modificar estado de pantalla del cliente donde vea que el negocio acepto el pedido, podria
        // usar la condicional de estado 'aceptado' para ir variando las imagenes que se le muestran al cliente en su pedido

        PedidoService.enviarPedidoACocina(idPedido);
        alert("Pedido aceptado")
    }

    function handleRechazarPedido(idPedido: number) {
        PedidoService.rechazarPedido(idPedido);
        alert("Pedido rechazado")
    }

    return (

        <div className="opciones-pantallas">
            <h1>Pedidos entrantes</h1>
            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Tipo de envío</th>
                            <th>Menu</th>
                            <th>Aceptar</th>
                            <th>Rechazar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosEntrantes.map(pedido => (
                            <tr key={pedido.id}>
                                <td>
                                    <div>
                                        <p>{pedido.cliente.nombre}</p>
                                        <p>{pedido.cliente.domicilio}</p>
                                        <p>{pedido.cliente.telefono}</p>
                                        <p>{pedido.cliente.email}</p>
                                    </div>
                                </td>
                                <td>{pedido.tipoEnvio}</td>
                                <td>
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.menu.nombre} - {detalle.cantidad}</p>
                                        </div>
                                    ))}
                                </td>
                                <td><button onClick={() => handleAceptarPedido(pedido.id)}>Aceptar</button></td>
                                <td><button onClick={() => handleRechazarPedido(pedido.id)}>Rechazar</button></td>
                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default PedidosEntrantes
