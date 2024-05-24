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
import ActivarStock from "./ActivarStock";
import ModalCrud from "../ModalCrud";


const Stocks = () => {
    const [stockIngredientes, setStockIngredientes] = useState<StockIngredientesDTO[]>([]);
    const [stockArticulos, setStockArticulos] = useState<StockArticuloVentaDTO[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showAgregarStockModalIngrediente, setShowAgregarStockModalIngrediente] = useState(false);
    const [showAgregarStockModalArticulo, setShowAgregarStockModalArticulo] = useState(false);
    const [showEditarStockModal, setShowEditarStockModal] = useState(false);
    const [showEliminarStockModal, setShowEliminarStockModal] = useState(false);
    const [showActivarStockModal, setShowActivarStockModal] = useState(false);

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
                console.log(data)
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
        setShowActivarStockModal(false);
        setMostrarStocks(false);
    };

    const handleActivarStock = (stock: StockArticuloVentaDTO | StockIngredientesDTO, tipo: string) => {
        stock.tipo = tipo;
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
        fetchStocks();
    };

    return (
        <div className="opciones-pantallas">

            <h1>- Stock -</h1>
            <div className="btns-stock">
                <button className="btn-agregar" onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
                <button className="btn-agregar" onClick={() => handleAgregarArticulo()}> + Agregar articulo</button>
            </div>

            <hr />

            <ModalFlotante isOpen={showAgregarStockModalArticulo} onClose={handleModalClose}>
                <AgregarStockArticulo />
            </ModalFlotante>

            <ModalCrud isOpen={showAgregarStockModalIngrediente} onClose={handleModalClose}>
                <AgregarStockIngrediente />
            </ModalCrud>

            <ModalFlotante isOpen={showEliminarStockModal} onClose={handleModalClose}>
                {selectedStock && <EliminarStock stockOriginal={selectedStock} onCloseModal={handleModalClose} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showActivarStockModal} onClose={handleModalClose}>
                {selectedStock && <ActivarStock stockOriginal={selectedStock} onCloseModal={handleModalClose} />}
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
                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                <button className="btn-accion-editar" onClick={() => handleEditarStock(stock, 'ingrediente')}>EDITAR</button>

                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarStock(stock, 'ingrediente')}>ELIMINAR</button>

                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                <button className="btn-accion-editar" onClick={() => handleEditarStock(stock, 'ingrediente')}>EDITAR</button>

                                                <button className="btn-accion-activar" onClick={() => handleActivarStock(stock, 'ingrediente')}>ACTIVAR</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {stockArticulos.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.nombreArticulo}</td>
                                    <td>{stock.cantidadActual}</td>
                                    <td>{stock.cantidadMinima}</td>
                                    <td>{stock.cantidadMaxima}</td>
                                    <td>{stock.precioCompra}</td>
                                    <td>{"Aca la fecha"}</td>

                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                <button className="btn-accion-editar" onClick={() => handleEditarStock(stock, 'articulo')}>EDITAR</button>

                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarStock(stock, 'articulo')}>ELIMINAR</button>

                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                <button className="btn-accion-editar" onClick={() => handleEditarStock(stock, 'articulo')}>EDITAR</button>

                                                <button className="btn-accion-activar" onClick={() => handleActivarStock(stock, 'articulo')}>ACTIVAR</button>
                                            </div>
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

export default Stocks
