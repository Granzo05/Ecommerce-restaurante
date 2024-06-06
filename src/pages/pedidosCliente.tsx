/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { PedidoService } from '../services/PedidoService';
import { Pedido } from '../types/Pedidos/Pedido';
import '../styles/pedidos.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { CarritoService } from '../services/CarritoService';
import Footer from '../components/Footer';
import Header from '../components/Header';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const PedidosCliente = () => {
    const [pedidosEntregados, setPedidosEntregados] = useState<Pedido[]>([]);
    const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);
    const [horaFinalizacion, setHoraFinalizacion] = useState<string[]>([]);
    const [tiempoRestante, setTiempoRestante] = useState<number[]>([]);
    const navigate = useNavigate();
    const query = useQuery();

    const externalReference = query.get('external_reference');
    const preference = query.get('preference_id');

    useEffect(() => {
        if (externalReference && parseInt(externalReference) > 0 && preference) {
            PedidoService.updateEstadoPedidoMercadopago(parseInt(externalReference), preference);
            CarritoService.limpiarCarrito();
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
            const data = await PedidoService.getPedidosClientes();
            if (data) {
                const entregados = [];
                const pendientes = [];
                const horasFinalizacion = [];

                for (const pedido of data) {
                    const estado = pedido.estado?.toString().trim().toLowerCase();
                    if (estado === 'entregados') {
                        entregados.push(pedido);
                    } else {
                        pendientes.push(pedido);
                        if (pedido.horaFinalizacion) {
                            horasFinalizacion.push(pedido.horaFinalizacion);
                        }
                    }
                }

                setPedidosEntregados(entregados);
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
        <>
            <Header />
            <div className="opciones-pantallas">
                {(pedidosEntregados.length > 0 || pedidosPendientes.length > 0) && (
                    <div id="pedidos-anteriores">
                        {pedidosPendientes.length > 0 && (
                            <div id="pedidos-pendientes">
                                <h1>Pedidos pendientes</h1>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tipo de envío</th>
                                            <th>Menu</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosPendientes.map((pedido, index) => (
                                            <tr key={pedido.id}>
                                                <td>
                                                    <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</p>
                                                    {tiempoRestante[index] > 0 && pedido.estado !== 'ENTREGADOS' ? (
                                                        <>
                                                            <p>El restaurante está preparando tu pedido</p>
                                                            <p>Tiempo restante: {Math.floor(tiempoRestante[index] / 60)}:{(Math.floor(tiempoRestante[index] % 60)).toString().padStart(2, '0')}</p>
                                                        </>
                                                    ) : (
                                                        <p>El pedido está listo para recoger</p>
                                                    )}
                                                </td>
                                                <td>
                                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                                        <div key={detalle.id}>
                                                            <p>{detalle.articuloMenu?.nombre}{detalle.articuloVenta?.nombre} - {detalle.cantidad}</p>
                                                        </div>
                                                    ))}
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

                        {pedidosEntregados.length > 0 && (
                            <>
                                <h1>Tus pedidos</h1>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Tipo de envío</th>
                                            <th>Menu</th>
                                            <th>Repetir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosEntregados.map(pedido => (
                                            <tr key={pedido.id}>
                                                <td>
                                                    <div>
                                                        <p>{pedido.cliente?.nombre}</p>
                                                        <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')} <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero} {pedido.domicilioEntrega?.localidad?.nombre}</p></p>
                                                        <p>{pedido.cliente?.telefono}</p>
                                                        <p>{pedido.cliente?.email}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</p>
                                                </td>
                                                <td>
                                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                                        <div key={detalle.id}>
                                                            <p>{detalle.articuloMenu?.nombre}{detalle.articuloVenta?.nombre} - {detalle.cantidad}</p>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td><button onClick={() => repetirPedido(pedido)}>Repetir pedido</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                )}
            </div>
            <Footer/>
        </>

    )
}
export default PedidosCliente
