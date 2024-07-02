import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { Toaster } from 'sonner';
import { CarritoService } from '../../services/CarritoService';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClienteService } from '../../services/ClienteService';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import ModalCrud from '../ModalCrud';
import DetallesPedido from '../Pedidos/DetallesPedido';
import { mostrarFecha } from '../../utils/global_variables/const';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const PedidosRechazados = () => {
    const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);
    const [horaFinalizacion, setHoraFinalizacion] = useState<string[]>([]);
    const [tiempoRestante, setTiempoRestante] = useState<number[]>([]);
    const query = useQuery();

    const externalReference = query.get('external_reference');
    const preference = query.get('preference_id');
    const navigate = useNavigate();

    useEffect(() => {
        if (externalReference && parseInt(externalReference) > 0 && preference) {
            PedidoService.updateEstadoPedidoMercadopago(parseInt(externalReference), preference);
            CarritoService.limpiarCarrito();
            navigate('/cliente/opciones/1');
            buscarPedidos();
        }
    }, [externalReference, preference]);

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        try {
            const data = await ClienteService.getPedidos(EnumEstadoPedido.RECHAZADOS);
            if (data) {
                const sortedData = data.sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());

                setPedidosPendientes(sortedData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const [showDetallesPedido, setShowDetallesPedido] = useState(false);

    const [selectedPedido, setSelectedPedido] = useState<Pedido>(new Pedido());
    const handleModalClose = () => {
        setShowDetallesPedido(false);
    };

    return (
        <div className="opciones-pantallas">
            <Toaster />
            <ModalCrud isOpen={showDetallesPedido} onClose={handleModalClose}>
                <DetallesPedido pedido={selectedPedido} />
            </ModalCrud>
            <h1>- Pedidos rechazados -</h1>
            <hr />
            <div id="pedidos">
                {pedidosPendientes.length > 0 && (
                    <div id="pedidos-pendientes">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha de pedido</th>
                                    <th>Tipo de envío</th>
                                    <th>Menu</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosPendientes.map((pedido, index) => (
                                    <tr key={pedido.id}>
                                        <td>{mostrarFecha(new Date(pedido.fechaPedido))}</td>
                                        <td>
                                            <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</p>
                                            <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero}, {pedido.domicilioEntrega?.localidad?.nombre}</p>                          
                                        </td>
                                        <td onClick={() => { setSelectedPedido(pedido); setShowDetallesPedido(true) }}>
                                            <button className="btn-accion-detalle">VER DETALLE</button>
                                        </td>
                                        <td>
                                            {pedido.estado === 'ENTRANTES' ? (
                                                <p>El restaurante aún no procesa el pedido</p>
                                            ) : pedido.estado === 'ACEPTADOS' ? (
                                                <p>El pedido se está preparando</p>
                                            ) : pedido.estado === 'COCINADOS' ? (
                                                <p>El pedido ya está listo</p>
                                            ) : pedido.estado === 'ENTREGADOS' ? (
                                                <p>El pedido ha sido entregado</p>
                                            ) : pedido.estado === 'EN_CAMINO' ? (
                                                <p>El pedido está en camino al domicilio</p>
                                            ) : pedido.estado === 'RECHAZADOS' ? (
                                                <p>El pedido ha sido rechazado por el restaurante</p>
                                            ) : pedido.estado === 'PROCESO_DE_PAGO' && (
                                                <p>El proceso de pago no ha finalizado correctamente</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PedidosRechazados;
