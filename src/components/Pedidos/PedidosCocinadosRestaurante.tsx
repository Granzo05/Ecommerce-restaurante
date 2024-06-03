import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';


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
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.ENTREGADOS), {
            loading: 'Entregando el pedido...',
            success: (message) => {
                return message;
            },
            error: (message) => {
                return message;
            },
        });
        buscarPedidos();
    }

    async function handleCancelarPedido(pedido: Pedido) {
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.RECHAZADOS), {
            loading: 'Rechazando el pedido...',
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
            <h1>- Pedidos listos -</h1>
            <Toaster />
            <hr />
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
                                        <p>{pedido.cliente?.telefono}</p>
                                        <p>{pedido.cliente?.email}</p>
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
