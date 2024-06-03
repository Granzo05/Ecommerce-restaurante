import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';


const PedidosEnCamino = () => {
    const [pedidosEntrantes, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.EN_CAMINO)
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function handleAceptarPedido(pedido: Pedido) {
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.ENTREGADOS), {
            loading: 'Enviando factura al cliente...',
            success: (message) => {
                return message;
            },
            error: (message) => {
                return message;
            },
        });

        buscarPedidos();
    }

    async function handleRechazarPedido(pedido: Pedido) {
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.RECHAZADOS), {
            loading: 'Rechazando pedido...',
            success: (message) => {
                return message;
            },
            error: (message) => {
                return message;
            },
        });

        buscarPedidos();
    }

    return (

        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos en camino -</h1>
            <hr />
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
                                        <p>{pedido.cliente?.nombre}</p>
                                        <p>{pedido.cliente?.telefono}</p>
                                        <p>{pedido.cliente?.email}</p>

                                        <p>{pedido.fechaPedido.toString()}</p>
                                    </div>
                                </td>
                                {pedido.tipoEnvio === EnumTipoEnvio.DELIVERY ? (
                                    <td>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')} <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero} {pedido.domicilioEntrega?.localidad?.nombre}</p></td>
                                ) : (
                                    <td>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</td>
                                )}
                                <td>
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.cantidad} - {detalle.articuloMenu?.nombre} </p>
                                            <p>{detalle.cantidad} - {detalle.articuloVenta?.nombre} </p>
                                        </div>
                                    ))}
                                </td>
                                <td><button onClick={() => handleAceptarPedido(pedido)}>Aceptar</button></td>
                                <td><button onClick={() => handleRechazarPedido(pedido)}>Rechazar</button></td>
                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default PedidosEnCamino
