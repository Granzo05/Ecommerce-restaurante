import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EliminarStock from "./EliminarStockEntrante";
import EditarStock from "./EditarStockEntrante";
import '../../styles/stock.css';
import { StockEntranteService } from "../../services/StockEntranteService";
import { StockEntrante } from "../../types/Stock/StockEntrante";
import AgregarStockEntrante from "./AgregarStockEntrante";

const StocksEntrantes = () => {
    const [stockEntrante, setStockEntrante] = useState<StockEntrante[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);

    const [selectedStock, setSelectedStock] = useState<StockEntrante | null>(null);

    useEffect(() => {

        StockEntranteService.getStock()
            .then(data => {
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

    const handleEditarStock = (stock: StockEntrante) => {
        setSelectedStock(stock);
        setShowEditarStockModal(true);
        setMostrarStocks(false);

    };

    const handleEliminarStock = (stock: StockEntrante) => {
        setSelectedStock(stock);
        setShowEliminarStockModal(true);
        setMostrarStocks(false);
    };

    const handleModalClose = () => {
        setShowAgregarStockModal(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);

        setMostrarStocks(true);
    };

    return (
        <div className="opciones-pantallas">

            <h1>Stocks</h1>
            <button onClick={() => handleAgregarStock()}> + Agregar stock entrante</button>

            <ModalCrud isOpen={showAgregarStockModal} onClose={handleModalClose}>
                <AgregarStockEntrante />
            </ModalCrud>

            {mostrarStocks && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Sucursal</th>
                                <th>Fecha</th>
                                <th>Costo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockEntrante.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock?.sucursal?.id}</td>
                                    <td>{stock.fechaLlegada?.toDateString()}</td>
                                    <td>{stock.costo}</td>
                                    <td>
                                        <button onClick={() => handleEliminarStock(stock)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ModalCrud isOpen={showEliminarStockModal} onClose={handleModalClose}>
                        {selectedStock && <EliminarStock stockEntrante={selectedStock} />}
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
