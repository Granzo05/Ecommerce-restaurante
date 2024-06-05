import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';

const PedidosRealizados = () => {
    const [pedidosRealizados, setPedidosRealizados] = useState<Pedido[]>([]);

    useEffect(() => {
        buscarPedidosRealizados();
    }, []);

    const buscarPedidosRealizados = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.REALIZADOS)
            .then(data => {
                setPedidosRealizados(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos realizados -</h1>
            <hr />
            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Tipo de envío</th>
                            <th>Menu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosRealizados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>
                                    <div>
                                        <p>{pedido.cliente?.nombre}</p>
                                        <p>{pedido.cliente?.telefono}</p>
                                        <p>{pedido.cliente?.email}</p>
                                        <p>{new Date(pedido.fechaPedido).toLocaleString()}</p>
                                    </div>
                                </td>
                                {pedido.tipoEnvio === EnumTipoEnvio.DELIVERY ? (
                                    <td>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')} <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero} {pedido.domicilioEntrega?.localidad?.nombre}</p></td>
                                ) : (
                                    <td>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</td>
                                )}
                                <td>
                                    {pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.cantidad} - {detalle.articuloMenu?.nombre} </p>
                                            <p>{detalle.cantidad} - {detalle.articuloVenta?.nombre} </p>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PedidosRealizados;
