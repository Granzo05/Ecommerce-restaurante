import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedido';
import '../../styles/pedidos.css';


const PedidosEntrantes = () => {
    const [pedidosEntrantes, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await EmpleadoService.checkUser();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        setInterval(() => {
            buscarPedidos();
        }, 15000);

    }, []);

    const buscarPedidos = async () => {
        PedidoService.getPedidos('entrantes')
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function handleAceptarPedido(pedido: Pedido) {
        const horaActual = new Date();

        // Calcular el tiempo de preparación en minutos
        const tiempoMayor: number = await calcularTiempoPreparacion(pedido);

        // Sumar los minutos del tiempo mayor al objeto Date
        horaActual.setMinutes(horaActual.getMinutes() + tiempoMayor);

        // Obtener horas y minutos de la hora estimada de finalización
        const horaFinalizacion = horaActual.getHours();
        const minutosFinalizacion = horaActual.getMinutes();

        // Formatear la hora estimada de finalización como una cadena HH:MM
        const horaFinalizacionFormateada = `${horaFinalizacion.toString().padStart(2, '0')}:${minutosFinalizacion.toString().padStart(2, '0')}`;

        // Almacenar la hora de finalización estimada en localStorage
        localStorage.setItem('horaFinalizacionPedido', horaFinalizacionFormateada);

        pedido.horaFinalizacion = horaFinalizacionFormateada;

        await PedidoService.updateEstadoPedido(pedido, 'aceptados');

        buscarPedidos();
    }


    async function calcularTiempoPreparacion(pedido: Pedido) {
        let tiempoTotal = 0;

        // Asignamos el tiempo del menú con la preparación más tardía
        pedido.detallesPedido.forEach(detalle => {
            if (detalle.menu.tiempoCoccion > tiempoTotal) {
                tiempoTotal = detalle.menu.tiempoCoccion;
            }
        });

        return tiempoTotal;
    }

    async function handleRechazarPedido(pedido: Pedido) {
        let response = await PedidoService.updateEstadoPedido(pedido, 'rechazados');
        alert(await response);
        buscarPedidos();
    }

    return (

        <div className="opciones-pantallas">
            <h1>Pedidos entrantes</h1>
            <div id="pedidos">
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
                        {pedidosEntrantes.map(pedido => (
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
                                <td><button onClick={() => handleAceptarPedido(pedido)}>Aceptar</button></td>
                                <td><button onClick={() => handleRechazarPedido(pedido)}>Rechazar</button></td>
                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default PedidosEntrantes
