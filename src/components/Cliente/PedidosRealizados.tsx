import { useEffect, useState } from 'react';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';
import { FacturaService } from '../../services/FacturaService';
import FacturaIMG from '../../assets/icons/facturas.png'
import { CarritoService } from '../../services/CarritoService';
import { useNavigate } from 'react-router-dom';
import { ClienteService } from '../../services/ClienteService';

const PedidosRealizados = () => {
    const [pedidosRealizados, setPedidosRealizados] = useState<Pedido[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        buscarPedidosRealizados();
    }, []);

    const buscarPedidosRealizados = async () => {
        ClienteService.getPedidos(EnumEstadoPedido.ENTREGADOS)
            .then(data => {
                setPedidosRealizados(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function descargarFactura(idPedido: number) {
        await FacturaService.getPdfFactura(idPedido);
    }

    function repetirPedido(pedido: Pedido) {
        pedido.detallesPedido.forEach(detalle => {
            if (detalle.articuloMenu) {
                CarritoService.agregarAlCarrito(detalle.articuloMenu, null, detalle.cantidad);
            } else if (detalle.articuloVenta) {
                CarritoService.agregarAlCarrito(null, detalle.articuloVenta, detalle.cantidad);
            }
        });

        navigate('/pago')
    }

    return (
        <div className="opciones-pantallas">
            <h1>- Pedidos realizados -</h1>
            <hr />
            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Tipo de envío</th>
                            <th>Menu</th>
                            <th>Volver a pedir</th>
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
                                    </div>
                                </td>
                                {pedido.tipoEnvio === EnumTipoEnvio.DELIVERY ? (
                                    <td>
                                        <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</p>
                                    </td>
                                ) : (
                                    <td>
                                        <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</p>
                                        <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero} {pedido.domicilioEntrega?.localidad?.nombre}</p>
                                    </td>

                                )}
                                <td onClick={() => descargarFactura(pedido.id)}><img src={FacturaIMG} alt="logo de factura" /></td>
                                <td><button onClick={() => repetirPedido(pedido)}>Repetir pedido</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PedidosRealizados;
