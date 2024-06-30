import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EditarStock from "./EditarStockEntrante";
import '../../styles/stock.css';
import { StockEntranteService } from "../../services/StockEntranteService";
import AgregarStockEntrante from "./AgregarStockEntrante";
import ActivarStockEntrante from "./ActivarStockEntrante";
import EliminarStockEntrante from "./EliminarStockEntrante";
import DetallesStock from "./DetallesStock";
import { DetalleStock } from "../../types/Stock/DetalleStock";
import { StockEntrante } from "../../types/Stock/StockEntrante";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import { toast, Toaster } from "sonner";
import { StockArticuloVentaService } from "../../services/StockArticulosService";
import { StockIngredientesService } from "../../services/StockIngredientesService";
import { desparsearMonedaArgentina, formatearFechaYYYYMMDD, parsearMonedaArgentina } from "../../utils/global_variables/functions";

const StocksEntrantes = () => {
    const [stockEntrante, setStockEntrante] = useState<StockEntrante[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);
    const [showActivarStockModal, setShowActivarStockModal] = useState(false);
    const [showDetallesStock, setShowDetallesStock] = useState(false);

    const [selectedStock, setSelectedStock] = useState<StockEntrante>(new StockEntrante());
    const [selectedDetalles, setSelectedDetalles] = useState<DetalleStock[]>([]);

    const formatDate = (date: Date) => {
        const dia = date.getDate() + 1;
        const mes = date.getMonth() + 1;
        const año = date.getFullYear();

        const diaFormateado = dia < 10 ? `0${dia}` : dia;
        const mesFormateado = mes < 10 ? `0${mes}` : mes;

        return `${diaFormateado}/${mesFormateado}/${año}`;
    };


    useEffect(() => {
        buscarStocks();
    }, []);

    function buscarStocks() {
        setDatosFiltrados([]);
        StockEntranteService.getStockPendiente()
            .then((stocks) => {
                setStockEntrante(stocks);
                stocks.forEach(stock => {
                    let suma = 0;

                    stock.detallesStock.forEach(detalle => {
                        suma += detalle.costoUnitario * detalle.cantidad;
                        stock.costo = suma.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');

        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);


    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<StockEntrante[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > stockEntrante.length) {
            setPaginasTotales(1);
            setDatosFiltrados(stockEntrante);
        } else {
            setPaginasTotales(Math.ceil(stockEntrante.length / cantidad));
            setDatosFiltrados(stockEntrante.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        if (fechaInicio.length > 0 && fechaFin.length > 0) {
            const fechaFiltroInicio = formatearFechaYYYYMMDD(new Date(fechaInicio));
            const fechaFiltroFin = formatearFechaYYYYMMDD(new Date(fechaFin));

            if (fechaFiltroInicio && fechaFiltroFin) {
                const filtradas = stockEntrante.filter(promocion => {
                    const fechaPromocion = formatearFechaYYYYMMDD(new Date(promocion.fechaLlegada));
                    if (fechaPromocion) return fechaPromocion >= fechaFiltroInicio && fechaPromocion <= fechaFiltroFin;
                });

                setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
                setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
            }
        } else if (fechaInicio.length > 0) {
            const fechaFiltro = formatearFechaYYYYMMDD(new Date(fechaInicio));
            if (fechaFiltro) {
                const filtradas = stockEntrante.filter(promocion => {
                    const fechaPromocion = formatearFechaYYYYMMDD(new Date(promocion.fechaLlegada));
                    if (fechaPromocion) return fechaPromocion >= fechaFiltro;
                });

                setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
                setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
            }
        } else if (fechaFin.length > 0) {
            const fechaFiltro = formatearFechaYYYYMMDD(new Date(fechaInicio));
            if (fechaFiltro) {
                const filtradas = stockEntrante.filter(promocion => {
                    const fechaPromocion = formatearFechaYYYYMMDD(new Date(promocion.fechaLlegada));
                    if (fechaPromocion) return fechaPromocion <= fechaFiltro;
                });

                setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
                setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
            }
        } else {
            setDatosFiltrados(stockEntrante.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(stockEntrante.length / cantidadProductosMostrables));
        }
    }, [fechaInicio, fechaFin]);

    const [signoPrecio, setSignoPrecio] = useState('>');

    const [precioBuscado, setPrecioBuscado] = useState<number>(0);

    useEffect(() => {
        filtrarPrecio();
    }, [signoPrecio, precioBuscado]);

    function filtrarPrecio() {
        const comparadores: { [key: string]: (a: number, b: number) => boolean } = {
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '=': (a, b) => a === b
        };

        if (precioBuscado > 0 && comparadores[signoPrecio]) {
            const filtradas = stockEntrante.filter(recomendacion =>
                comparadores[signoPrecio](
                    desparsearMonedaArgentina(recomendacion.costo),
                    precioBuscado
                )
            );

            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(stockEntrante.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(stockEntrante.length / cantidadProductosMostrables));
        }
    }

    const ordenarPorFecha = (a: StockEntrante, b: StockEntrante) => {
        // Suponiendo que 'fecha' es un atributo Date en cada objeto
        const fechaA = new Date(a.fechaLlegada);
        const fechaB = new Date(b.fechaLlegada);

        // Comparamos las fechas
        if (fechaA < fechaB) {
            return -1;
        }
        if (fechaA > fechaB) {
            return 1;
        }
        return 0;
    };
    useEffect(() => {
        if (stockEntrante.length > 0) {
            const stockOrdenado = [...stockEntrante].sort(ordenarPorFecha);
            setDatosFiltrados(stockOrdenado.slice(indexPrimerProducto, indexUltimoProducto));
        } else {
            setDatosFiltrados([]);
        }
    }, [stockEntrante, paginaActual, cantidadProductosMostrables]);

    useEffect(() => {
        if (stockEntrante.length > 0) cantidadDatosMostrables(11);
    }, [stockEntrante]);

    async function checkPrivilegies() {
        if (empleado && empleado.privilegios?.length > 0) {
            try {
                empleado?.privilegios?.forEach(privilegio => {
                    if (privilegio.nombre === 'Empleados' && privilegio.permisos.includes('READ')) {
                        if (privilegio.permisos.includes('CREATE')) {
                            setCreateVisible(true);
                        }
                        if (privilegio.permisos.includes('UPDATE')) {
                            setUpdateVisible(true);
                        }
                        if (privilegio.permisos.includes('DELETE')) {
                            setDeleteVisible(true);
                        }
                        if (privilegio.permisos.includes('ACTIVATE')) {
                            setActivateVisible(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (sucursal && sucursal.id > 0) {
            setCreateVisible(true);
            setActivateVisible(true);
            setDeleteVisible(true);
            setUpdateVisible(true);
        }
    }

    const handleAgregarStock = () => {
        setShowAgregarStockModal(true);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(false);
        setShowDetallesStock(false);
        setMostrarStocks(false);
    };

    const handleEditarStock = (stock: StockEntrante) => {
        setSelectedStock(stock);
        setShowAgregarStockModal(false);
        setShowEditarStockModal(true);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(false);
        setShowDetallesStock(false);
        setMostrarStocks(false);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleCargarStock = (stock: StockEntrante) => {
        setIsLoading(true);

        setSelectedStock(stock);

        const promises = stock.detallesStock.map(detalle => {
            if (detalle.ingrediente?.nombre?.length > 0 && detalle.cantidad > 0) {
                return StockIngredientesService.reponerStock(detalle.ingrediente.nombre, detalle.cantidad);
            } else if (detalle.articuloVenta?.nombre?.length > 0 && detalle.cantidad > 0) {
                return StockArticuloVentaService.reponerStock(detalle.articuloVenta.nombre, detalle.cantidad);
            }
            return null;
        }).filter(Boolean);

        toast.promise(
            Promise.all(promises),
            {
                loading: 'Actualizando el stock...',
                error: 'Hubo un error al actualizar el stock.',
            }
        );

        stock.estado = 'ENTREGADOS';

        toast.promise(StockEntranteService.updateStock(stock), {
            loading: 'Creando stock entrante...',
            success: (message) => {
                buscarStocks();
                return message;
            },
            error: (message) => {
                return message;
            },
            finally: () => {
                setIsLoading(false);
            }
        });
    };

    const handleEliminarStock = (stock: StockEntrante) => {
        setSelectedStock(stock);
        setShowAgregarStockModal(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(true);
        setShowActivarStockModal(false);
        setShowDetallesStock(false);
        setMostrarStocks(false);
    };

    const handleActivarStock = (stock: StockEntrante) => {
        setSelectedStock(stock);
        setShowAgregarStockModal(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(true);
        setShowDetallesStock(false);
        setMostrarStocks(false);
    };

    const handleModalClose = () => {
        setShowAgregarStockModal(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(false);
        setShowDetallesStock(false);
        setMostrarStocks(true);
        buscarStocks();
    };

    const handleMostrarDetalles = (detalles: DetalleStock[]) => {
        setSelectedDetalles(detalles);
        setShowAgregarStockModal(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(false);
        setShowDetallesStock(true);
        setMostrarStocks(false);
    };


    return (
        <div className="opciones-pantallas">
            <h1>- Stock entrante -</h1>
            <Toaster />

            {createVisible && (
                <div className="btns-empleados">
                    <button className="btn-agregar" onClick={() => handleAgregarStock()}> + Agregar stock entrante</button>
                </div>)}
            <hr />
            <ModalCrud isOpen={showAgregarStockModal} onClose={handleModalClose}>
                <AgregarStockEntrante onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showDetallesStock} onClose={handleModalClose}>
                <DetallesStock detallesOriginal={selectedDetalles} />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarStockModal} onClose={handleModalClose}>
                {selectedStock && <EliminarStockEntrante stockEntrante={selectedStock} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarStockModal} onClose={handleModalClose}>
                {selectedStock && <ActivarStockEntrante stockEntrante={selectedStock} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarStockModal} onClose={handleModalClose}>
                {selectedStock && <EditarStock stockEntrante={selectedStock} onCloseModal={handleModalClose} />}
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

                <div className="filtros-datos">
                    <div className="inputBox-filtrado-fechas" style={{ marginRight: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>Filtrar entre fecha:</label>
                        <input
                            type="date"
                            required
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                    </div>
                    <div className="inputBox-filtrado-fechas" style={{ marginRight: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>y fecha:</label>

                        <input
                            type="date"
                            required
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="number"
                            required
                            onChange={(e) => setPrecioBuscado(parseInt(e.target.value))}
                        />
                        <span>Filtrar por precio</span>

                    </div>
                    <div className="inputBox-filtrado" style={{ marginLeft: '-15px' }}>
                        <select id="signos" name="signo" value={signoPrecio} onChange={(e) => setSignoPrecio(e.target.value)}>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                            <option value="=">=</option>
                        </select>
                    </div>
                </div>


            </div>

            {mostrarStocks && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha de entrada</th>
                                <th>Costo total</th>
                                <th>Detalles</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(stock => (
                                <tr key={stock.id}>
                                    <td>{formatDate(new Date(stock.fechaLlegada.toString()))}</td>
                                    <td>${stock.costo}</td>
                                    <td className="detalle-stock-entrante" onClick={() => handleMostrarDetalles(stock.detallesStock)}><button className="btn-accion-detalle">VER DETALLE</button></td>

                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            {deleteVisible && (
                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarStock(stock)}>ELIMINAR</button>
                                            )}
                                            {updateVisible && (
                                                <button className="btn-accion-editar" onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                            )}
                                            {updateVisible && (
                                                <button className="btn-accion-entregado" onClick={() => handleCargarStock(stock)} disabled={isLoading}>
                                                    {isLoading ? 'Cargando...' : 'MARCAR COMO ENTREGADO'}
                                                </button>
                                            )}
                                            {!updateVisible && !deleteVisible && (
                                                <p>No tenes privilegios para interactuar con estos datos</p>
                                            )}
                                        </td>
                                    ) : (
                                        <td>
                                            {activateVisible && (
                                                <button className="btn-accion-activar" onClick={() => handleActivarStock(stock)}>ACTIVAR</button>
                                            )}
                                            {updateVisible && (
                                                <button className="btn-accion-editar" onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                            )}
                                            {!updateVisible && !activateVisible && (
                                                <p>No tenes privilegios para interactuar con estos datos</p>
                                            )}
                                        </td>
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
            )}

        </div>
    )
}

export default StocksEntrantes
