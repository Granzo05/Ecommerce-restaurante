/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { PedidoService } from '../services/PedidoService';
import { Pedido } from '../types/Pedidos/Pedido';
import '../styles/pedidos.css';
import { useLocation } from 'react-router-dom';
import { EnumEstadoPedido } from '../types/Pedidos/EnumEstadoPedido';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const PedidosCliente = () => {
    const [pedidosEntregados, setPedidosEntregados] = useState<Pedido[]>([]);
    const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);
    const [, setTiempoRestante] = useState<number>(0);
    const [minutosRestantes, setMinutosRestantes] = useState<number>(0);
    const [segundosRestantes, setSegundosRestantes] = useState<number>(0);
    const [horaFinalizacion, setHoraFinalizacion] = useState<string>('');

    let query = useQuery();

    const externalReference = query.get('external_reference');
    const preference = query.get('preference_id');

    useEffect(() => {
        if (externalReference && parseInt(externalReference) > 0 && preference && preference.length > 0) {
            PedidoService.updateEstadoPedidoMercadopago(parseInt(externalReference), preference);
        }
        console.log(externalReference)
        console.log(preference)
    }, [externalReference, preference]);

    useEffect(() => {
        //buscarPedidos();

        const actualizarTiempoRestante = () => {
            if (horaFinalizacion) {
                const tiempoRestante = calcularTiempoRestante();
                setTiempoRestante(tiempoRestante);
            }
        };

        const intervalo = setInterval(actualizarTiempoRestante, 1000);

        return () => clearInterval(intervalo);
    }, [horaFinalizacion]);

    const buscarPedidos = async () => {
        try {
            const data = await PedidoService.getPedidosClientes();
            if (data) {
                const entregados = data.filter(pedido => pedido.estado?.toString().includes('entregados'));
                const pendientes = data.filter(pedido => !pedido.estado?.toString().includes('entregados'));
                setPedidosEntregados(entregados);
                setPedidosPendientes(pendientes);

                if (pendientes.length > 0) {
                    setHoraFinalizacion(pendientes[0].horaFinalizacion);
                }
            } else {
                console.log('No hay pedidos');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function calcularTiempoRestante() {
        const [horas, minutos] = horaFinalizacion.split(':').map(Number);

        const horaFinalizacionPedido = new Date();
        horaFinalizacionPedido.setHours(horas);
        horaFinalizacionPedido.setMinutes(minutos);
        horaFinalizacionPedido.setSeconds(0);

        const horaActual = new Date();

        const tiempoRestante = Math.max(0, (horaFinalizacionPedido.getTime() - horaActual.getTime()) / 1000);

        setMinutosRestantes(Math.floor(tiempoRestante / 60));
        setSegundosRestantes(tiempoRestante % 60);

        return tiempoRestante;
    }

    return (
        <div className="opciones-pantallas">
            {pedidosEntregados.length > 0 || pedidosPendientes.length > 0 && (
                <div id="pedidos-anteriores">
                    {pedidosPendientes.length > 0 && (
                        <div id="pedidos-pendientes">
                            <h1>Pedidos pendientes</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tipo de envío</th>
                                        <th>Menu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosPendientes.map(pedido => (
                                        <tr key={pedido.id}>
                                            <td>{pedido.tipoEnvio}</td>
                                            <td>
                                                {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                                    <div key={detalle.id}>
                                                        <p>{detalle.articuloMenu?.nombre} - {detalle.cantidad}</p>
                                                        <p>{detalle.articuloVenta?.nombre} - {detalle.cantidad}</p>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p>El restaurante está preparando tu pedido</p>

                            <video width="600" height="400" autoPlay loop muted >
                                <source src="src\pages\delivery.mp4" type="video/mp4"></source>
                            </video>

                            <p>Tiempo restante: {minutosRestantes}:{segundosRestantes}</p>

                        </div>
                    )}

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
                                            <p>{pedido.cliente?.nombre}</p>
                                            <td>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')} <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero} {pedido.domicilioEntrega?.localidad?.nombre}</p></td>
                                            <p>{pedido.cliente?.telefono}</p>
                                            <p>{pedido.cliente?.email}</p>
                                        </div>
                                    </td>
                                    <td>{pedido.tipoEnvio}</td>
                                    <td>
                                        {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                            <div key={detalle.id}>
                                                <p>{detalle.articuloMenu?.nombre} - {detalle.cantidad}</p>
                                                <p>{detalle.articuloVenta?.nombre} - {detalle.cantidad}</p>
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
