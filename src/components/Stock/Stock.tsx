import { useEffect, useState } from "react";
import EliminarStock from "./EliminarStock";
import EditarStock from "./EditarStock";
import '../../styles/stock.css';
import { StockIngredientesService } from "../../services/StockIngredientesService";
import { StockArticuloVentaService } from "../../services/StockArticulosService";
import AgregarStockArticulo from "./AgregarStockArticulo";
import AgregarStockIngrediente from "./AgregarStockIngrediente";
import ModalFlotante from "../ModalFlotante";
import ActivarStock from "./ActivarStock";
import ModalCrud from "../ModalCrud";
import { StockArticuloVenta } from "../../types/Stock/StockArticuloVenta";
import { StockIngredientes } from "../../types/Stock/StockIngredientes";
import { formatearFechaDDMMYYYY } from "../../utils/global_variables/functions";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";


const Stocks = () => {
    const [stockIngredientes, setStockIngredientes] = useState<StockIngredientes[]>([]);
    const [stockArticulos, setStockArticulos] = useState<StockArticuloVenta[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModalIngrediente, setShowAgregarStockModalIngrediente] = useState(false);
    const [showAgregarStockModalArticulo, setShowAgregarStockModalArticulo] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);
    const [showActivarStockModal, setShowActivarStockModal] = useState(false);
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState<string | undefined>();

    const [selectedStock, setSelectedStock] = useState<StockArticuloVenta | StockIngredientes>();

    useEffect(() => {
        getIngredientes();
        getArticulos();
    }, []);

    const getIngredientes = async () => {
        StockIngredientesService.getStock()
            .then(data => {
                setStockIngredientes(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const getArticulos = async () => {
        StockArticuloVentaService.getStock()
            .then(data => {
                setStockArticulos(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Stock' && privilegio.permisos.includes('READ')) {
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
        }
    }

    const handleAgregarIngrediente = () => {
        setShowAgregarStockModalIngrediente(true);
        setMostrarStocks(false);
    };

    const handleAgregarArticulo = () => {
        setShowAgregarStockModalArticulo(true);
        setMostrarStocks(false);
    };

    const handleEditarStock = (stock: StockArticuloVenta | StockIngredientes) => {
        setSelectedStock(stock);
        setShowEditarStockModal(true);
        setMostrarStocks(false);
    };

    const handleEliminarStock = (stock: StockArticuloVenta | StockIngredientes) => {
        setSelectedStock(stock);
        setShowEliminarStockModal(true);
        setShowActivarStockModal(false);
        setMostrarStocks(false);
    };

    const handleActivarStock = (stock: StockArticuloVenta | StockIngredientes) => {
        setSelectedStock(stock);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(true);
        setMostrarStocks(false);
    };

    const handleModalClose = () => {
        setShowAgregarStockModalArticulo(false);
        setShowAgregarStockModalIngrediente(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(false);

        setMostrarStocks(true);
        getArticulos();
        getIngredientes();
    };

    return (
        <div className="opciones-pantallas">

            <h1>- Stock -</h1>
            {createVisible && (
                <div className="btns-stock">
                    <button className="btn-agregar" onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
                    <button className="btn-agregar" onClick={() => handleAgregarArticulo()}> + Agregar articulo</button>
                </div>)}

            <p><span className="cuadrado venta"></span>Artículos para venta</p>
            <p><span className="cuadrado noventa"></span>Artículos para no venta</p>

            <hr />

            <ModalCrud isOpen={showAgregarStockModalArticulo} onClose={handleModalClose}>
                <AgregarStockArticulo onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showAgregarStockModalIngrediente} onClose={handleModalClose}>
                <AgregarStockIngrediente onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalFlotante isOpen={showEliminarStockModal} onClose={handleModalClose}>
                {selectedStock && <EliminarStock stockOriginal={selectedStock} onCloseModal={handleModalClose} tipo={tipo} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showActivarStockModal} onClose={handleModalClose}>
                {selectedStock && <ActivarStock stockOriginal={selectedStock} onCloseModal={handleModalClose} tipo={tipo} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showEditarStockModal} onClose={handleModalClose}>
                {selectedStock && <EditarStock onCloseModal={handleModalClose} stockOriginal={selectedStock} tipo={tipo} nombre={nombre} />}
            </ModalFlotante>

            {mostrarStocks && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cantidad actual</th>
                                <th>Cantidad minima</th>
                                <th>Cantidad máxima</th>
                                <th>Costo</th>
                                <th>Fecha próximo ingreso</th>
                                <th>¿Venta?</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stockIngredientes.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.ingrediente?.nombre}</td>
                                    <td style={{ textTransform: 'lowercase' }}>{stock.cantidadActual} {stock.medida?.nombre}</td>
                                    <td style={{ textTransform: 'lowercase' }}>{stock.cantidadMinima} {stock.medida?.nombre}</td>
                                    <td style={{ textTransform: 'lowercase' }}>{stock.cantidadMaxima} {stock.medida?.nombre}</td>
                                    <td>${stock.precioCompra}</td>
                                    <td>{stock.fechaLlegadaProxima ? (
                                        formatearFechaDDMMYYYY(new Date(stock.fechaLlegadaProxima))
                                    ) : (
                                        <p>No hay próximas entradas</p>
                                    )}
                                    </td>
                                    <td style={{ backgroundColor: '#f51a1a' }}>NO</td>
                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('ingrediente'); setNombre(stock.ingrediente?.nombre) }}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => { handleEliminarStock(stock); setTipo('ingrediente') }}>ELIMINAR</button>
                                                )}
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('ingrediente'); setNombre(stock.ingrediente?.nombre) }}>EDITAR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => { handleActivarStock(stock); setTipo('ingrediente') }}>ACTIVAR</button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {stockArticulos.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.articuloVenta?.nombre}</td>
                                    <td style={{ textTransform: 'lowercase' }}>{stock.cantidadActual} {stock.medida?.nombre}</td>
                                    <td style={{ textTransform: 'lowercase' }}>{stock.cantidadMinima} {stock.medida?.nombre}</td>
                                    <td style={{ textTransform: 'lowercase' }}>{stock.cantidadMaxima} {stock.medida?.nombre}</td>
                                    <td>${stock.precioCompra}</td>
                                    <td>{'No hay próximas entradas'}</td>
                                    <td style={{ backgroundColor: '#19cc37' }}>SI</td>
                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('articulo'); setNombre(stock.articuloVenta?.nombre) }}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => { handleEliminarStock(stock); setTipo('articulo') }}>ELIMINAR</button>
                                                )}
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('articulo'); setNombre(stock.articuloVenta?.nombre) }}>EDITAR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => { handleActivarStock(stock); setTipo('articulo') }}>ACTIVAR</button>
                                                )}
                                            </div>
                                        </td>
                                    )
                                    }
                                </tr >
                            ))}
                        </tbody >
                    </table >
                </div >
            )}

        </div >
    )
}

export default Stocks
