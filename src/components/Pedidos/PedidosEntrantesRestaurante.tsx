import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';
import { DESACTIVAR_PRIVILEGIOS } from '../../utils/global_variables/const';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empleado } from '../../types/Restaurante/Empleado';


const PedidosEntrantes = () => {
    const [pedidosEntrantes, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        /*
        setInterval(() => {
            buscarPedidos();
        }, 25000);
        */
        buscarPedidos();

    }, []);

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
                buscarPedidos();
                return message;
            },
            error: (message) => {
                return message;
            },
        });

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

    useEffect(() => {
        checkPrivilegies();
    }, []);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Empleados' && privilegio.permisos.includes('READ')) {
                        if (privilegio.permisos.includes('UPDATE')) {
                            setUpdateVisible(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (sucursal && sucursal.id > 0) {
            setUpdateVisible(true);
        }
    }

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');

        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);

    const parseDate = (dateOriginal: string) => {
        const date = new Date(dateOriginal);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year}  ${hours}:${minutes}`
    };


    const [paginaActual, setPaginaActual] = useState(1);
    const [productosMostrables, setProductosMostrables] = useState(10);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * productosMostrables;
    const indexPrimerProducto = indexUltimoProducto - productosMostrables;

    // Obtener los elementos de la página actual
    const pedidosFiltrados = pedidosEntrantes.slice(indexPrimerProducto, indexUltimoProducto);

    const paginasTotales = Math.ceil(pedidosEntrantes.length / productosMostrables);

    // Cambiar de página
    const paginate = (paginaActual: number) => setPaginaActual(paginaActual);

    return (

        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos entrantes -</h1>
            <hr />
            <div id="pedidos">
                <select name="cantidadProductos" value={productosMostrables} onChange={(e) => setProductosMostrables(parseInt(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                </select>
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
                        {pedidosFiltrados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>
                                    <div>
                                        <p>{pedido.cliente?.nombre}</p>
                                        <p>{pedido.cliente?.telefono}</p>
                                        <p>{pedido.cliente?.email}</p>

                                        <p>{parseDate(pedido.fechaPedido.toString())}</p>
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
                                <td>
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.cantidad} - {detalle.articuloMenu?.nombre}{detalle.articuloVenta?.nombre} </p>
                                        </div>
                                    ))}
                                </td>
                                {updateVisible && (
                                    <td><button onClick={() => handleAceptarPedido(pedido)}>Aceptar</button></td>
                                )}
                                {updateVisible && (
                                    <td><button onClick={() => handleRechazarPedido(pedido)}>Rechazar</button></td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {Array.from({ length: paginasTotales }, (_, index) => (
                        <button key={index + 1} onClick={() => paginate(index + 1)} disabled={paginaActual === index + 1}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default PedidosEntrantes
