import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import '../../styles/pedidos.css';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';
import { Empleado } from '../../types/Restaurante/Empleado';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { DESACTIVAR_PRIVILEGIOS } from '../../utils/global_variables/const';


const PedidosEnCamino = () => {
    const [pedidosEnCamino, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.EN_CAMINO)
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function handleAceptarPedido(pedido: Pedido) {
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.ENTREGADOS), {
            loading: 'Enviando factura al cliente...',
            success: (message) => {
                return message;
            },
            error: (message) => {
                return message;
            },
        });

        buscarPedidos();
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




    const [paginaActual, setPaginaActual] = useState(1);
    const [productosMostrables, setProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * productosMostrables;
    const indexPrimerProducto = indexUltimoProducto - productosMostrables;

    // Obtener los elementos de la página actual
    const pedidosFiltrados = pedidosEnCamino.slice(indexPrimerProducto, indexUltimoProducto);

    const paginasTotales = Math.ceil(pedidosEnCamino.length / productosMostrables);

    // Cambiar de página
    const paginate = (paginaActual: number) => setPaginaActual(paginaActual);

    return (

        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos en camino -</h1>
            <hr />

            <div className="filtros">
                <div className="inputBox-filtrado">
                    <select id="cantidad" name="cantidadProductos" value={productosMostrables} onChange={(e) => setProductosMostrables(parseInt(e.target.value))}>
                        <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="filtros-datos">
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                        />
                        <span>Filtrar por cliente</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                        />
                        <span>Filtrar por tipo de envío</span>
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="text"
                            required
                        />
                        <span>Filtrar por menú</span>
                    </div>
                </div>


            </div>
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
                        {pedidosFiltrados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>
                                    <div>
                                        <p>{pedido.cliente?.nombre}</p>
                                        <p>{pedido.cliente?.telefono}</p>
                                        <p>{pedido.cliente?.email}</p>

                                        <p>{pedido.fechaPedido.toString()}</p>
                                    </div>
                                </td>
                                {pedido.tipoEnvio === EnumTipoEnvio.DELIVERY ? (
                                    <td>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')} <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero} {pedido.domicilioEntrega?.localidad?.nombre}</p></td>
                                ) : (
                                    <td>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</td>
                                )}
                                <td>
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.cantidad} - {detalle.articuloMenu?.nombre} </p>
                                            <p>{detalle.cantidad} - {detalle.articuloVenta?.nombre} </p>
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

export default PedidosEnCamino
