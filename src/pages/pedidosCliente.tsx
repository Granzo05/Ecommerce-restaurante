import { useEffect, useState } from 'react';
import { PedidoService } from '../services/PedidoService';
import { Pedido } from '../types/Pedido';
import '../styles/pedidos.css';


const PedidosCliente = () => {
    const [pedidosEntregados, setPedidosEntregados] = useState<Pedido[]>([]);
    const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        try {
            const data = await PedidoService.getPedidosClientes();
            console.log(data);
            if (data) {                
                const entregados = data.filter(pedido => pedido.estado.includes('entregados'));
                const pendientes = data.filter(pedido => !pedido.estado.includes('entregados'));
                setPedidosEntregados(entregados);
                setPedidosPendientes(pendientes);
            } else {
                console.log('No hay pedidos');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="opciones-pantallas">
            {pedidosPendientes.length > 0 && (
                <div id="pedidos-pendientes">
                    <h1>Pedidos pendientes</h1>
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
                            {pedidosPendientes.map(pedido => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pedidosEntregados.length > 0 && (
                <div id="pedidos-anteriores">
                    <h1>Tus pedidos</h1>
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
                            {pedidosEntregados.map(pedido => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div >
    )
}

export default PedidosCliente
