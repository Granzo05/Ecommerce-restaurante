import { useEffect, useState } from "react";
import { EmpleadoService } from "../../services/EmpleadoService";
import { StockService } from "../../services/StockService";
import AgregarStock from "./AgregarStock";
import Modal from "../Modal";
import { Stock } from "../../types/Stock";
import EliminarStock from "./EliminarStock";
import EditarStock from "./EditarStock";

const Stocks = () => {
    EmpleadoService.checkUser('empleado');

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
        <div >
            <h1 onClick={() => handleAgregarStock()}>Stocks</h1>
            <button> + Agregar stock</button>

            <Modal isOpen={showAgregarStockModal} onClose={handleModalClose}>
                <AgregarStock />
            </Modal>

            <div id="stocks">
                {stocks.map(stock => (
                    <div key={stock.id} className="grid-item">
                        <h3>{stock.ingrediente.nombre}</h3>
                        <h3>{stock.cantidad}</h3>
                        <h3>{stock.fechaIngreso.toISOString()}</h3>
                        <h3>{stock.ingrediente.costo}</h3>

                        <button onClick={() => handleEliminarStock(stock.id)}>ELIMINAR</button>
                        <Modal isOpen={showEliminarStockModal} onClose={handleModalClose}>
                            {selectedId && <EliminarStock stockId={selectedId} />}
                        </Modal>
                        <button onClick={() => handleEditarStock}>EDITAR</button>
                        <Modal isOpen={showEditarStockModal} onClose={handleModalClose}>
                            {selectedStock && <EditarStock stockOriginal={selectedStock} />}
                        </Modal>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Stocks
