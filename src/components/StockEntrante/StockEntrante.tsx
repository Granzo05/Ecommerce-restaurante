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
            <div className="btns-stock">
                <button className="btn-agregar" onClick={() => handleAgregarStock()}> + Agregar stock entrante</button>
            </div>

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
                            {stockEntrante.map(stock => (
                                <tr key={stock.id}>
                                    <td>{formatDate(new Date(stock.fechaLlegada.toString()))}</td>
                                    <td>{stock.costo}</td>
                                    <td onClick={() => handleMostrarDetalles(stock.detallesStock)}>Detalle stock</td>

                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <button className="btn-accion-eliminar" onClick={() => handleEliminarStock(stock)}>ELIMINAR</button>
                                            <button className="btn-accion-editar" onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                        </td>
                                    ) : (
                                        <td>
                                            <button className="btn-accion-activar" onClick={() => handleActivarStock(stock)}>ACTIVAR</button>
                                            <button className="btn-accion-editar" onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    )
}

export default StocksEntrantes
