import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EliminarStock from "./EliminarStock";
import EditarStock from "./EditarStock";
import { EmpleadoService } from "../../services/EmpleadoService";
import '../../styles/stock.css';
import { StockIngredientesService } from "../../services/StockIngredientesService";
import { StockArticuloVentaService } from "../../services/StockArticulosService";
import AgregarStockArticulo from "./AgregarStockArticulo";
import AgregarStockIngrediente from "./AgregarStockIngrediente";
import { StockIngredientesDTO } from "../../types/Stock/StockIngredientesDTO";
import { StockArticuloVentaDTO } from "../../types/Stock/StockArticuloVentaDTO";

const Stocks = () => {
    const [stockIngredientes, setStockIngredientes] = useState<StockIngredientesDTO[]>([]);
    const [stockArticulos, setStockArticulos] = useState<StockArticuloVentaDTO[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModalIngrediente, setShowAgregarStockModalIngrediente] = useState(false);
    const [showAgregarStockModalArticulo, setShowAgregarStockModalArticulo] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);

    const [selectedStock, setSelectedStock] = useState<StockArticuloVentaDTO | StockIngredientesDTO | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Esto retorna true o false
                await EmpleadoService.checkUser();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        StockIngredientesService.getStock()
            .then(data => {
                console.log(data);
                setStockIngredientes(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        StockArticuloVentaService.getStock()
            .then(data => {
                setStockArticulos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }, []);

    const handleAgregarIngrediente = () => {
        setShowAgregarStockModalIngrediente(true);
        setMostrarStocks(false);
    };

    const handleAgregarArticulo = () => {
        setShowAgregarStockModalArticulo(true);
        setMostrarStocks(false);
    };

    const handleEditarStock = (stock: StockArticuloVentaDTO | StockIngredientesDTO) => {
        setSelectedStock(stock);
        setShowEditarStockModal(true);
        setMostrarStocks(false);

    };

    const handleEliminarStock = (stock: StockArticuloVentaDTO | StockIngredientesDTO) => {
        setSelectedStock(stock);
        setShowEliminarStockModal(true);
        setMostrarStocks(false);
    };

    const handleModalClose = () => {
        setShowAgregarStockModalArticulo(false);
        setShowAgregarStockModalIngrediente(false);
        setShowEditarStockModal(false);
        setShowEliminarStockModal(false);

        setMostrarStocks(true);

    };

    return (
        <div className="opciones-pantallas">

            <h1>Stocks</h1>
            <button onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
            <button onClick={() => handleAgregarArticulo()}> + Agregar articulo</button>

            <ModalCrud isOpen={showAgregarStockModalArticulo} onClose={handleModalClose}>
                <AgregarStockArticulo />
            </ModalCrud>

            <ModalCrud isOpen={showAgregarStockModalIngrediente} onClose={handleModalClose}>
                <AgregarStockIngrediente />
            </ModalCrud>
            
            <ModalCrud isOpen={showEliminarStockModal} onClose={handleModalClose}>
                {selectedStock && <EliminarStock stockOriginal={selectedStock} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarStockModal} onClose={handleModalClose}>
                {selectedStock && <EditarStock stockOriginal={selectedStock} />}
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
                            {stockIngredientes.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.nombreIngrediente}</td>
                                    <td>{stock.cantidadActual}</td>
                                    <td>{stock.precioCompra}</td>
                                    <td>{"Aca la fecha"}</td>
                                    <td>
                                        <button onClick={() => handleEliminarStock(stock)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                    </td>
                                </tr>
                            ))}
                            {stockArticulos.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.nombreArticuloVenta}</td>
                                    <td>{stock.cantidadActual}</td>
                                    <td>{stock.cantidadMaxima}</td>
                                    <td>{stock.precioCompra}</td>
                                    <td>{"Aca la fecha"}</td>
                                    <td>
                                        <button onClick={() => handleEliminarStock(stock)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarStock(stock)}>EDITAR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    )
}

export default Stocks
