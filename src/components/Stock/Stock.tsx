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
import InputComponent from "../InputFiltroComponent";
import ModalFlotanteRecomendaciones from "../ModalFlotanteRecomendaciones";
import SearchIcon from '@mui/icons-material/Search';
import ActivarStock from "./ActivarStock";


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
        stock.borrado = 'SI';
        setSelectedStock(stock);
        setShowEliminarStockModal(true);
        setShowActivarStockModal(false);
        setMostrarStocks(false);
    };

    const handleActivarStock = (stock: StockArticuloVentaDTO | StockIngredientesDTO, tipo: string) => {
        stock.tipo = tipo;
        stock.borrado = 'NO';
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

        setMostrarStocks(true);
        fetchStocks();
        setModalBusqueda(false);


    };

    // Modal flotante de ingrediente
    const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [elementosABuscar, setElementosABuscar] = useState<string>('');

    const handleAbrirRecomendaciones = (busqueda: string) => {
        setElementosABuscar(busqueda)
        setModalBusqueda(true);
    };

    const handleSelectProduct = (product: string) => {
        setSelectedProduct(product);
    };

    return (
        <div className="opciones-pantallas">

            <h1>- Stock -</h1>
            <div className="btns-stock">
                <button className="btn-agregar" onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
                <button className="btn-agregar" onClick={() => handleAgregarArticulo()}> + Agregar articulo</button>
            </div>

            <hr />
            <div className="input-filtrado">
                <InputComponent placeHolder={'Filtrar...'} onInputClick={() => handleAbrirRecomendaciones('INGREDIENTES')} selectedProduct={selectedProduct ?? ''} />
                {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}

            </div>
            <ModalFlotante isOpen={showAgregarStockModalArticulo} onClose={handleModalClose}>
                <AgregarStockArticulo />
            </ModalFlotante>

            <ModalFlotante isOpen={showAgregarStockModalIngrediente} onClose={handleModalClose}>
                <AgregarStockIngrediente />
            </ModalFlotante>

            <ModalFlotante isOpen={showEliminarStockModal} onClose={handleModalClose}>
                {selectedStock && <EliminarStock stockOriginal={selectedStock} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showActivarStockModal} onClose={handleModalClose}>
                {selectedStock && <ActivarStock stockOriginal={selectedStock} />}
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
                                        <div className="btns-acciones-stock">

                                            <button className="btn-accion-1" onClick={() => handleEditarStock(stock, 'ingrediente')}>EDITAR</button>
                                            <button className="btn-accion-2" onClick={() => handleEliminarStock(stock, 'ingrediente')}>ELIMINAR</button>
                                        </div>
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

                                    </td>
                                    {stock.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                <button className="btn-accion-1" onClick={() => handleEditarStock(stock, 'articulo')}>EDITAR</button>

                                                <button className="btn-accion-2" onClick={() => handleEliminarStock(stock, 'articulo')}>ELIMINAR</button>

                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                <button className="btn-accion-1" onClick={() => handleEditarStock(stock, 'articulo')}>EDITAR</button>

                                                <button className="btn-accion-2" onClick={() => handleActivarStock(stock, 'articulo')}>ACTIVAR</button>
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
