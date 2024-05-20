import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';


const PedidosEntrantes = () => {
    const [pedidosEntrantes, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        //fetchData();
        /*
        setInterval(() => {
            buscarPedidos();
        }, 25000);
        */
        buscarPedidos();

    }, []);

    const fetchData = async () => {
        try {
            await EmpleadoService.checkUser();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const buscarPedidos = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.ENTRANTES)
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

        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.ACEPTADOS), {
            loading: 'Enviando pedido a cocina...',
            success: (message) => {
                return message;
            },
            error: (message) => {
                return message;
            },
        });

        buscarPedidos();
    }


    async function calcularTiempoPreparacion(pedido: Pedido) {
        let tiempoTotal = 0;

        // Asignamos el tiempo del menú con la preparación más tardía
        pedido.detallesPedido.forEach(detalle => {
            if (detalle.articuloMenu && detalle.articuloMenu.tiempoCoccion > tiempoTotal) {
                tiempoTotal = detalle.articuloMenu.tiempoCoccion;
            }
        });

        return tiempoTotal;
    }

    async function handleRechazarPedido(pedido: Pedido) {
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.RECHAZADOS), {
            loading: 'Rechazando pedido...',
            success: (message) => {
                return message;
            },
            error: (message) => {
                return message;
            },
        });

        buscarPedidos();
    }

    return (

        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos entrantes -</h1>
            <hr />
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
