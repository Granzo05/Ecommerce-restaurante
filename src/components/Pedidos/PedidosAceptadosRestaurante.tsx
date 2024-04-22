import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedido';
import { EmpleadoService } from '../../services/EmpleadoService';

const PedidosAceptados = () => {
    const [PedidosAceptados, setPedidos] = useState<Pedido[]>([]);

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
        PedidoService.getPedidos('aceptados')
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function handleFinalizarPedido(pedido: Pedido) {
        let response = await PedidoService.updateEstadoPedido(pedido, 'cocinados');
        alert(await response);
        buscarPedidos();
    }

    return (

        <div className="opciones-pantallas">
            <h1>Pedidos aceptados</h1>
            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Menu</th>
                            <th>Finalizar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PedidosAceptados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.menu.nombre} - {detalle.cantidad}</p>
                                        </div>
                                    ))}
                                </td>
                                <td><button onClick={() => handleFinalizarPedido(pedido)}>Finalizar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default PedidosAceptados
