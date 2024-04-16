import { useEffect, useState } from "react";
import { StockService } from "../../services/StockService";
import AgregarStock from "./AgregarStock";
import ModalCrud from "../ModalCrud";
import { Stock } from "../../types/Stock";
import EliminarStock from "./EliminarStock";
import EditarStock from "./EditarStock";
import { EmpleadoService } from "../../services/EmpleadoService";
import '../../styles/stock.css';

const Stocks = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);

    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Esto retorna true o false
                await EmpleadoService.checkUser('empleado');
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

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
        setMostrarStocks(false);
    };

    const handleEditarStock = (stock: Stock) => {
        setSelectedStock(stock);
        setShowEditarStockModal(true);
        setMostrarStocks(false);

    };

    const handleEliminarStock = (stockId: number) => {
        setSelectedId(stockId);
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
            <button onClick={() => handleAgregarStock()}> + Agregar stock</button>

            <ModalCrud isOpen={showAgregarStockModal} onClose={handleModalClose}>
                <AgregarStock />
            </ModalCrud>

            {mostrarStocks && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Costo</th>
                                <th>Fecha próximo ingreso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.ingrediente.nombre}</td>
                                    <td>{stock.cantidad}</td>
                                    <td>{stock.ingrediente.costo}</td>
                                    <td>{new Date(stock.fechaIngreso).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                                    <td>
                                        <button onClick={() => handleEliminarStock(stock.id)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ModalCrud isOpen={showEliminarStockModal} onClose={handleModalClose}>
                        {selectedId && <EliminarStock stockId={selectedId} />}
                    </ModalCrud>

                    <ModalCrud isOpen={showEditarStockModal} onClose={handleModalClose}>
                        {selectedStock && <EditarStock stockOriginal={selectedStock} />}
                    </ModalCrud>

                </div>
            )}

        </div>
    )
}

export default Stocks
