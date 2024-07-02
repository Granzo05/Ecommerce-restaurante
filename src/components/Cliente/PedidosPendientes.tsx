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

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const PedidosPendientes = () => {
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

    useEffect(() => {
        const intervalo = setInterval(() => {
            actualizarTiempoRestante();
        }, 1000);

        return () => clearInterval(intervalo);
    }, [horaFinalizacion]);

    const buscarPedidos = async () => {
        try {
            const data = await ClienteService.getPedidos(EnumEstadoPedido.ENTRANTES);
            if (data) {
                const pendientes = [];
                const horasFinalizacion = [];

                for (const pedido of data) {
                    pendientes.push(pedido);
                    if (pedido.horaFinalizacion) {
                        horasFinalizacion.push(pedido.horaFinalizacion);
                    }
                }

                setPedidosPendientes(pendientes);

                setHoraFinalizacion(horasFinalizacion);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const actualizarTiempoRestante = () => {
        const tiemposRestantes = horaFinalizacion.map(hora => calcularTiempoRestante(hora));
        setTiempoRestante(tiemposRestantes);
    }

    const calcularTiempoRestante = (horaFinalizacion: string) => {
        if (horaFinalizacion) {
            const [horas, minutos] = horaFinalizacion.split(':').map(Number);

            const horaFinalizacionPedido = new Date();
            horaFinalizacionPedido.setHours(horas);
            horaFinalizacionPedido.setMinutes(minutos);
            horaFinalizacionPedido.setSeconds(0);

            const horaActual = new Date();

            const tiempoRestante = Math.max(0, (horaFinalizacionPedido.getTime() - horaActual.getTime()) / 1000);

            return tiempoRestante;
        }
        return 0;
    }

    const [showDetallesPedido, setShowDetallesPedido] = useState(false);

    const [selectedPedido, setSelectedPedido] = useState<Pedido>(new Pedido());
    const handleModalClose = () => {
        setShowDetallesPedido(false);
    };

    function mostrarFecha(fecha: Date) {
        // Obtener los componentes de la fecha
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        // Formatear la fecha y hora
        return `${dia}-${mes}-${año} - ${horas}:${minutos} `;
    }

    return (
        <div className="opciones-pantallas">
            <Toaster />
            <ModalCrud isOpen={showDetallesPedido} onClose={handleModalClose}>
                <DetallesPedido pedido={selectedPedido} />
            </ModalCrud>
            <h1>- Pedidos pendientes -</h1>
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
                                            {tiempoRestante[index] > 0 && pedido.estado !== 'ENTREGADOS' && (
                                                <>
                                                    <p>El restaurante está preparando tu pedido</p>
                                                    <p>Tiempo restante: {Math.floor(tiempoRestante[index] / 60)}:{(Math.floor(tiempoRestante[index] % 60)).toString().padStart(2, '0')}</p>
                                                </>
                                            )}
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

export default PedidosPendientes;
