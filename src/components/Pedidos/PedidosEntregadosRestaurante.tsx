import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import { EmpleadoService } from '../../services/EmpleadoService';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';

const PedidosEntregados = () => {
    const [pedidosEntregados, setPedidos] = useState<Pedido[]>([]);

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
        PedidoService.getPedidos(EnumEstadoPedido.ENTREGADOS)
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    return (

        <div className="opciones-pantallas">
            <h1>Pedidos entregados</h1>
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
                        {pedidosEntregados.map(pedido => (
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
                                            <p>{detalle.articuloVenta?.nombre} - {detalle.cantidad}</p>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default PedidosEntregados
