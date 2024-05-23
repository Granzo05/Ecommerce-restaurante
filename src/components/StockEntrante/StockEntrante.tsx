import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EditarStock from "./EditarStockEntrante";
import '../../styles/stock.css';
import { StockEntranteService } from "../../services/StockEntranteService";
import AgregarStockEntrante from "./AgregarStockEntrante";
import ActivarStockEntrante from "./ActivarStockEntrante";
import EliminarStockEntrante from "./EliminarStockEntrante";
import { StockEntranteDTO } from "../../types/Stock/StockEntranteDTO";
import ModalFlotante from "../ModalFlotante";
import DetallesStock from "./DetallesStock";

const StocksEntrantes = () => {
    const [stockEntrante, setStockEntrante] = useState<StockEntranteDTO[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);
    const [showActivarStockModal, setShowActivarStockModal] = useState(false);
    const [showDetallesStock, setShowDetallesStock] = useState(false);

    const [selectedStock, setSelectedStock] = useState<StockEntranteDTO>(new StockEntranteDTO());
    const [selectedDetalles, setSelectedDetalles] = useState<DetallesStock>(new DetallesStock());

    useEffect(() => {
        StockEntranteService.getStock()
            .then(data => {
                console.log(data)
                setStockEntrante(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleAgregarStock = () => {
        setShowAgregarStockModal(true);
        setMostrarStocks(false);
    };

    const handleEditarStock = (stock: StockEntranteDTO) => {
        setSelectedStock(stock);
        setShowEditarStockModal(true);
        setMostrarStocks(false);

    };

    const handleEliminarStock = (stock: StockEntranteDTO) => {
        stock.borrado = 'SI';
        setSelectedStock(stock);
        setShowEliminarStockModal(true);
        setShowActivarStockModal(false);
        setMostrarStocks(false);
    };

    const handleActivarStock = (stock: StockEntranteDTO) => {
        stock.borrado = 'NO';
        setSelectedStock(stock);
        setShowEliminarStockModal(false);
        setShowActivarStockModal(true);
        setMostrarStocks(false);
    };

    const handleModalClose = () => {
        setShowAgregarStockModal(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);
        setShowDetallesStock(false);
        setMostrarStocks(true);
    };

    const handleMostrarDetalles = (detalles: DetallesStock) => {
        setSelectedDetalles(detalles);
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
                <AgregarStockEntrante />
            </ModalCrud>

            <ModalFlotante isOpen={showDetallesStock} onClose={handleModalClose}>
                <DetallesStock detallesOriginal={selectedDetalles}/>
            </ModalFlotante>

            {mostrarStocks && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Costo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockEntrante.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.fechaLlegada?.toString()}</td>
                                    <td onClick={() => handleMostrarDetalles(stock.detallesStock)}>Detalle stock</td>

                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <button onClick={() => handleEliminarStock(stock)}>ELIMINAR</button>
                                            <button onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                        </td>
                                    ) : (
                                        <td>
                                            <button onClick={() => handleActivarStock(stock)}>ACTIVAR</button>
                                            <button onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ModalCrud isOpen={showEliminarStockModal} onClose={handleModalClose}>
                        {selectedStock && <EliminarStockEntrante stockEntrante={selectedStock} onCloseModal={handleModalClose} />}
                    </ModalCrud>

                    <ModalCrud isOpen={showActivarStockModal} onClose={handleModalClose}>
                        {selectedStock && <ActivarStockEntrante stockEntrante={selectedStock} onCloseModal={handleModalClose} />}
                    </ModalCrud>

                    <ModalCrud isOpen={showEditarStockModal} onClose={handleModalClose}>
                        {selectedStock && <EditarStock stockEntrante={selectedStock} />}
                    </ModalCrud>

                </div>
            )}

        </div>
    )
}

export default StocksEntrantes
