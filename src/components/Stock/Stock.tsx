import { useEffect, useState } from "react";
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
import ModalFlotante from "../ModalFlotante";

const Stocks = () => {
    const [stockIngredientes, setStockIngredientes] = useState<StockIngredientesDTO[]>([]);
    const [stockArticulos, setStockArticulos] = useState<StockArticuloVentaDTO[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModalIngrediente, setShowAgregarStockModalIngrediente] = useState(false);
    const [showAgregarStockModalArticulo, setShowAgregarStockModalArticulo] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);

    const [selectedStock, setSelectedStock] = useState<StockArticuloVentaDTO | StockIngredientesDTO>();

    useEffect(() => {
        fetchData();
        fetchStocks();
    }, []);

    const fetchData = async () => {
        try {
            await EmpleadoService.checkUser();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchStocks = async () => {
        StockIngredientesService.getStock()
            .then(data => {
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
    };

    const handleAgregarIngrediente = () => {
        setShowAgregarStockModalIngrediente(true);
        setMostrarStocks(false);
    };

    const handleAgregarArticulo = () => {
        setShowAgregarStockModalArticulo(true);
        setMostrarStocks(false);
    };

    const handleEditarStock = (stock: StockArticuloVentaDTO | StockIngredientesDTO, tipo: string) => {
        stock.tipo = tipo;
        setSelectedStock(stock);

        setShowEditarStockModal(true);
        setMostrarStocks(false);
    };

    const handleEliminarStock = (stock: StockArticuloVentaDTO | StockIngredientesDTO, tipo: string) => {
        stock.tipo = tipo;
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
        fetchStocks();
    };

    return (
        <div className="opciones-pantallas">

            <h1>Stocks</h1>
            <button onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
            <button onClick={() => handleAgregarArticulo()}> + Agregar articulo</button>

            <ModalFlotante isOpen={showAgregarStockModalArticulo} onClose={handleModalClose}>
                <AgregarStockArticulo />
            </ModalFlotante>

            <ModalFlotante isOpen={showAgregarStockModalIngrediente} onClose={handleModalClose}>
                <AgregarStockIngrediente />
            </ModalFlotante>

            <ModalFlotante isOpen={showEliminarStockModal} onClose={handleModalClose}>
                {selectedStock && <EliminarStock stockOriginal={selectedStock} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showEditarStockModal} onClose={handleModalClose}>
                {selectedStock && <EditarStock stockOriginal={selectedStock} />}
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
                                    <td>{stock.nombreIngrediente}</td>
                                    <td>{stock.cantidadActual}</td>
                                    <td>{stock.cantidadMinima}</td>
                                    <td>{stock.cantidadMaxima}</td>
                                    <td>{stock.precioCompra}</td>
                                    <td>{"Aca la fecha"}</td>
                                    <td>
                                        <button onClick={() => handleEliminarStock(stock, 'ingrediente')}>ELIMINAR</button>
                                        <button onClick={() => handleEditarStock(stock, 'ingrediente')}>EDITAR</button>
                                    </td>
                                </tr>
                            ))}
                            {stockArticulos.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.nombreArticuloVenta}</td>
                                    <td>{stock.cantidadActual}</td>
                                    <td>{stock.cantidadMinima}</td>
                                    <td>{stock.cantidadMaxima}</td>
                                    <td>{stock.precioCompra}</td>
                                    <td>{"Aca la fecha"}</td>
                                    <td>
                                        <button onClick={() => handleEliminarStock(stock, 'articulo')}>ELIMINAR</button>
                                        <button onClick={() => handleEditarStock(stock, 'articulo')}>EDITAR</button>
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
