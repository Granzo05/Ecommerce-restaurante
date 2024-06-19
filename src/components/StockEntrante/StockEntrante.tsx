import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EditarStock from "./EditarStockEntrante";
import '../../styles/stock.css';
import { StockEntranteService } from "../../services/StockEntranteService";
import AgregarStockEntrante from "./AgregarStockEntrante";
import ActivarStockEntrante from "./ActivarStockEntrante";
import EliminarStockEntrante from "./EliminarStockEntrante";
import ModalFlotante from "../ModalFlotante";
import DetallesStock from "./DetallesStock";
import { DetalleStock } from "../../types/Stock/DetalleStock";
import { StockEntrante } from "../../types/Stock/StockEntrante";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import { toast } from "sonner";
import { StockArticuloVentaService } from "../../services/StockArticulosService";
import { StockIngredientesService } from "../../services/StockIngredientesService";

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
        StockEntranteService.getStock()
            .then((stocks: StockEntrante[]) => {
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
    const [productosMostrables, setProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * productosMostrables;
    const indexPrimerProducto = indexUltimoProducto - productosMostrables;

    // Obtener los elementos de la página actual
    const stockFiltrado = stockEntrante.slice(indexPrimerProducto, indexUltimoProducto);

    const paginasTotales = Math.ceil(stockEntrante.length / productosMostrables);

    // Cambiar de página
    const paginate = (paginaActual: number) => setPaginaActual(paginaActual);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Empleados' && privilegio.permisos.includes('READ')) {
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

    const handleCargarStock = (stock: StockEntrante) => {
        setSelectedStock(stock);

        const promises = stock.detallesStock.map(detalle => {
            if (detalle.ingrediente?.nombre?.length > 0 && detalle.cantidad > 0) {
                return StockIngredientesService.reponerStock(detalle.ingrediente.nombre, detalle.cantidad);
            } else if (detalle.articuloVenta?.nombre?.length > 0 && detalle.cantidad > 0) {
                return StockArticuloVentaService.reponerStock(detalle.articuloVenta.nombre, detalle.cantidad);
            }
        }).filter(Boolean);

        toast.promise(
            Promise.all(promises),
            {
                loading: 'Actualizando el stock...',
                success: 'Stock actualizado correctamente!',
                error: 'Hubo un error al actualizar el stock.',
            }
        );
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

            {createVisible && (
                <div className="btns-stock">
                    <button className="btn-agregar" onClick={() => handleAgregarStock()}> + Agregar stock entrante</button>
                </div>)}
            <hr />
            <ModalCrud isOpen={showAgregarStockModal} onClose={handleModalClose}>
                <AgregarStockEntrante onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalFlotante isOpen={showDetallesStock} onClose={handleModalClose}>
                <DetallesStock detallesOriginal={selectedDetalles} />
            </ModalFlotante>

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
                        <span>Filtrar por fecha</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="number"
                            required
                        />
                        <span>Filtrar por costo</span>
                    </div>
                    
                </div>


            </div>

            {mostrarStocks && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Costo</th>
                                <th>Detalles</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockFiltrado.map(stock => (
                                <tr key={stock.id}>
                                    <td>{formatDate(new Date(stock.fechaLlegada.toString()))}</td>
                                    <td>{stock.costo}</td>
                                    <td onClick={() => handleMostrarDetalles(stock.detallesStock)}>Detalle stock</td>

                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            {deleteVisible && (
                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarStock(stock)}>ELIMINAR</button>
                                            )}
                                            {updateVisible && (
                                                <button className="btn-accion-editar" onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                            )}
                                            {updateVisible && (
                                                <button className="btn-accion-editar" onClick={() => handleCargarStock(stock)}>MARCAR COMO ENTREGADO</button>
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
