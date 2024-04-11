import { useEffect, useState } from "react";
import { StockService } from "../../services/StockService";
import AgregarStock from "./AgregarStock";
import ModalCrud from "../ModalCrud";
import { Stock } from "../../types/Stock";
import EliminarStock from "./EliminarStock";
import EditarStock from "./EditarStock";

const Stocks = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);

    const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);

    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(0);

    useEffect(() => {
        StockService.getStock()
            .then(data => {
                setStocks(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleAgregarStock = () => {
        setShowAgregarStockModal(true);
    };

    const handleEditarStock = (stock: Stock) => {
        setSelectedStock(stock);
        setShowEditarStockModal(true);
    };

    const handleEliminarStock = (stockId: number) => {
        setSelectedId(stockId);
        setShowEliminarStockModal(true);
    };

    const handleModalClose = () => {
        setShowAgregarStockModal(false);
        setShowEditarStockModal(false);
    };

    return (
        <div className="opciones-pantallas">

            <h1>Stocks</h1>
            <button onClick={() => handleAgregarStock()}> + Agregar stock</button>

            <ModalCrud isOpen={showAgregarStockModal} onClose={handleModalClose}>
                <AgregarStock />
            </ModalCrud>

            <div id="stocks">
                {stocks.map(stock => (
                    <div key={stock.id} className="grid-item">
                        <h3>{stock.ingrediente.nombre}</h3>
                        <h3>{stock.cantidad}</h3>
                        <h3>{stock.costo}</h3>
                        <h3>{stock.fechaIngreso.toISOString()}</h3>

                        <button onClick={() => handleEliminarStock(stock.id)}>ELIMINAR</button>
                        <ModalCrud isOpen={showEliminarStockModal} onClose={handleModalClose}>
                            {selectedId && <EliminarStock stockId={selectedId} />}
                        </ModalCrud>
                        <button onClick={() => handleEditarStock}>EDITAR</button>
                        <ModalCrud isOpen={showEditarStockModal} onClose={handleModalClose}>
                            {selectedStock && <EditarStock stockOriginal={selectedStock} />}
                        </ModalCrud>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Stocks
