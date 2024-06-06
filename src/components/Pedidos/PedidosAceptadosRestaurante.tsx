import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';

const PedidosAceptados = () => {
    const [PedidosAceptados, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.ACEPTADOS)
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function handleFinalizarPedido(pedido: Pedido) {
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.COCINADOS), {
            loading: 'Enviando pedido al administrador...',
            success: (message) => {
                buscarPedidos();
                return message;
            },
            error: (message) => {
                return message;
            },
        });
    }

    return (

        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos aceptados -</h1>
            <hr />
            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de envío</th>
                            <th>Menu</th>
                            <th>Finalizar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PedidosAceptados.map(pedido => (
                            <tr key={pedido.id}>
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
