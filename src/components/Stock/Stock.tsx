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

    const [selectedStock, setSelectedStock] = useState<StockArticuloVenta | StockIngredientes>();

    useEffect(() => {
        getIngredientes();
        getArticulos();
    }, []);

    const getIngredientes = async () => {
        StockIngredientesService.getStock()
            .then(data => {
                console.log(data);
                setStockIngredientes(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const getArticulos = async () => {
        StockArticuloVentaService.getStock()
            .then(data => {
                console.log(data);
                setStockArticulos(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };


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
            <div className="btns-stock">
                <button className="btn-agregar" onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
                <button className="btn-agregar" onClick={() => handleAgregarArticulo()}> + Agregar articulo</button>
            </div>

            <hr />

            <ModalCrud isOpen={showAgregarStockModalArticulo} onClose={handleModalClose}>
                <AgregarStockArticulo />
            </ModalCrud>

            <ModalCrud isOpen={showAgregarStockModalIngrediente} onClose={handleModalClose}>
                <AgregarStockIngrediente />
            </ModalCrud>

            <ModalFlotante isOpen={showEliminarStockModal} onClose={handleModalClose}>
                {selectedStock && <EliminarStock stockOriginal={selectedStock} onCloseModal={handleModalClose} tipo={tipo} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showActivarStockModal} onClose={handleModalClose}>
                {selectedStock && <ActivarStock stockOriginal={selectedStock} onCloseModal={handleModalClose} tipo={tipo} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showEditarStockModal} onClose={handleModalClose}>
                {selectedStock && <EditarStock stockOriginal={selectedStock} tipo={tipo} />}
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
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stockIngredientes.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.ingrediente?.nombre}</td>
                                    <td>{stock.cantidadActual}</td>
                                    <td>{stock.cantidadMinima}</td>
                                    <td>{stock.cantidadMaxima}</td>
                                    <td>{stock.precioCompra}</td>
                                    <td>{"Aca la fecha"}</td>
                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('ingrediente') }}>EDITAR</button>

                                                <button className="btn-accion-eliminar" onClick={() => { handleEliminarStock(stock); setTipo('ingrediente') }}>ELIMINAR</button>

                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('ingrediente') }}>EDITAR</button>

                                                <button className="btn-accion-activar" onClick={() => { handleActivarStock(stock); setTipo('ingrediente') }}>ACTIVAR</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {stockArticulos.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.articuloVenta?.nombre}</td>
                                    <td>{stock.cantidadActual}</td>
                                    <td>{stock.cantidadMinima}</td>
                                    <td>{stock.cantidadMaxima}</td>
                                    <td>{stock.precioCompra}</td>
                                    <td>{"Aca la fecha"}</td>

                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('articulo') }}>EDITAR</button>

                                                <button className="btn-accion-eliminar" onClick={() => { handleEliminarStock(stock); setTipo('ingrediente') }}>ELIMINAR</button>

                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                <button className="btn-accion-editar" onClick={() => { handleEditarStock(stock); setTipo('ingrediente') }}>EDITAR</button>

                                                <button className="btn-accion-activar" onClick={() => { handleActivarStock(stock); setTipo('ingrediente') }}>ACTIVAR</button>
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
