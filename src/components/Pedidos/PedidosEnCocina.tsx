import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';
import ModalCrud from '../ModalCrud';
import DetallesPedido from './DetallesPedido';
import { Empleado } from '../../types/Restaurante/Empleado';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { DESACTIVAR_PRIVILEGIOS, mostrarFecha } from '../../utils/global_variables/const';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';

const PedidosAceptados = () => {
    const [pedidosAceptados, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        setDatosFiltrados([]);
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        setDatosFiltrados([]);
        PedidoService.getPedidos(EnumEstadoPedido.ACEPTADOS)
            .then(data => {
                const sortedData = data.sort((a, b) => new Date(a.fechaPedido).getTime() - new Date(b.fechaPedido).getTime());
                setPedidos(sortedData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    const [isLoading, setIsLoading] = useState(false);

    async function handleFinalizarPedido(pedido: Pedido) {
        setIsLoading(true);
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.COCINADOS), {
            loading: 'Enviando pedido al administrador...',
            success: (message) => {
                return message;
            },
            error: (message) => {
                return message;
            },
            finally: () => {
                buscarPedidos();
                setIsLoading(false);
            }
        });
    }

    useEffect(() => {
        checkPrivilegies();
    }, []);

    async function checkPrivilegies() {
        if (empleado && empleado.privilegios?.length > 0) {
            try {
                empleado?.privilegios?.forEach(privilegio => {
                    if (privilegio.nombre === 'Empleados' && privilegio.permisos.includes('READ')) {
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


    const [showDetallesPedido, setShowDetallesPedido] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<Pedido>(new Pedido());

    const handleModalClose = () => {
        setShowDetallesPedido(false);
    };

    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<Pedido[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > pedidosAceptados.length) {
            setPaginasTotales(1);
            setDatosFiltrados(pedidosAceptados);
        } else {
            setPaginasTotales(Math.ceil(pedidosAceptados.length / cantidad));
            setDatosFiltrados(pedidosAceptados.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    useEffect(() => {
        if (pedidosAceptados.length > 0) cantidadDatosMostrables(11);
    }, [pedidosAceptados]);

    function filtrarMenus(filtro: string) {
        if (filtro.length > 0) {
            let filtradas = pedidosAceptados.filter(recomendacion =>
                recomendacion.detallesPedido.some(detalle =>
                    detalle.articuloMenu?.nombre.toLowerCase().includes(filtro.toLowerCase())
                )
            );

            if (filtradas.length === 0) {
                filtradas = pedidosAceptados.filter(recomendacion =>
                    recomendacion.detallesPedido.some(detalle =>
                        detalle.articuloVenta?.nombre.toLowerCase().includes(filtro.toLowerCase())
                    )
                );
            }

            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(pedidosAceptados.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(pedidosAceptados.length / cantidadProductosMostrables));
        }
    }


    function filtrarEnvio(filtro: number) {
        if (filtro > 0) {
            const filtradas = pedidosAceptados.filter(recomendacion =>
                recomendacion.tipoEnvio === filtro
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(pedidosAceptados.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(pedidosAceptados.length / cantidadProductosMostrables));
        }
    }

    function filtrarId(filtro: number) {
        if (filtro > 0) {
            const filtradas = pedidosAceptados.filter(recomendacion =>
                recomendacion.id === filtro
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(pedidosAceptados.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(pedidosAceptados.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (pedidosAceptados.length > 0) {
            setDatosFiltrados(pedidosAceptados.slice(indexPrimerProducto, indexUltimoProducto));
        } else {
            setDatosFiltrados([]);
        }
    }, [pedidosAceptados, paginaActual, cantidadProductosMostrables]);

    return (

        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos aceptados -</h1>
            <hr />
            <ModalCrud isOpen={showDetallesPedido} onClose={handleModalClose}>
                <DetallesPedido pedido={selectedPedido} />
            </ModalCrud>

            <div className="filtros">
                <div className="inputBox-filtrado">
                    <select id="cantidad" name="cantidadProductos" value={cantidadProductosMostrables} onChange={(e) => cantidadDatosMostrables(parseInt(e.target.value))}>
                        <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="filtros-datos" >
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarId(parseInt(e.target.value))}
                        />
                        <span>Filtrar por ID</span>
                    </div>
                    
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarMenus(e.target.value)}
                        />
                        <span>Filtrar por menú</span>
                    </div>
                    <div className="inputBox-filtrado" >
                        <select name="" id="" onChange={(e) => filtrarEnvio(parseInt(e.target.value))}>
                            <option value={0}>Seleccionar tipo de envío (Todos)</option>
                            <option value={EnumTipoEnvio.DELIVERY}>Retiro en tienda</option>
                            <option value={EnumTipoEnvio.RETIRO_EN_TIENDA}>Delivery</option>
                        </select>
                    </div>
                </div>


            </div>

            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo de envío</th>
                            <th>Fecha</th>
                            <th>Menu</th>
                            <th>Finalizar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosFiltrados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.tipoEnvio.toString().replace(/_/g, ' ')}</td>
                                <td>{mostrarFecha(new Date(pedido.fechaPedido))}</td>

                                <td onClick={() => { setSelectedPedido(pedido); setShowDetallesPedido(true) }}>
                                <button className="btn-accion-detalle">VER DETALLE</button>
                                </td>
                                <td>
                                    {updateVisible && (
                                        <button className='btn-accion-activar' onClick={() => handleFinalizarPedido(pedido)} disabled={isLoading}>
                                            {isLoading ? 'Cargando...' : 'FINALIZAR ✓'}
                                        </button>
                                    )}
                                </td>

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

export default PedidosAceptados
