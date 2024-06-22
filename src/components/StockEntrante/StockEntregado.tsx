import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import { StockEntranteService } from "../../services/StockEntranteService";
import DetallesStock from "./DetallesStock";
import { DetalleStock } from "../../types/Stock/DetalleStock";
import { StockEntrante } from "../../types/Stock/StockEntrante";

const StocksEntregado = () => {
    const [stockEntrante, setStockEntrante] = useState<StockEntrante[]>([]);
    const [mostrarStocks, setMostrarStocks] = useState(true);

    const [showDetallesStock, setShowDetallesStock] = useState(false);

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
        setDatosFiltrados([]);
        buscarStocks();
    }, []);

    function buscarStocks() {
        StockEntranteService.getStockEntregados()
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

    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<StockEntrante[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > stockEntrante.length) {
            setPaginasTotales(1);
            setDatosFiltrados(stockEntrante);
        } else {
            setPaginasTotales(Math.ceil(stockEntrante.length / cantidad));
            setDatosFiltrados(stockEntrante.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarFechas(fechaInicio: string, fechaFin: string) {
        if (fechaInicio.length > 0 && fechaFin.length > 0) {
            const fechaFiltroInicio = new Date(fechaInicio);
            const fechaFiltroFin = new Date(fechaFin);

            const filtradas = stockEntrante.filter(promocion => {
                const fechaPromocion = new Date(promocion.fechaLlegada);
                return fechaPromocion >= fechaFiltroInicio && fechaPromocion <= fechaFiltroFin;
            });

            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else if (fechaInicio.length > 0) {
            const fechaFiltro = new Date(fechaInicio);

            const filtradas = stockEntrante.filter(promocion => {
                const fechaPromocion = new Date(promocion.fechaLlegada);
                return fechaPromocion.toDateString() === fechaFiltro.toDateString();
            });
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else if (fechaFin.length > 0) {
            const fechaFiltro = new Date(fechaFin);

            const filtradas = stockEntrante.filter(promocion => {
                const fechaPromocion = new Date(promocion.fechaLlegada);
                return fechaPromocion.toDateString() === fechaFiltro.toDateString();
            });
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(stockEntrante.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(stockEntrante.length / cantidadProductosMostrables));
        }
    }

    const [signoPrecio, setSignoPrecio] = useState('>');

    function filtrarPrecio(filtro: number) {
        const comparadores: { [key: string]: (a: number, b: number) => boolean } = {
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '=': (a, b) => a === b
        };

        if (filtro > 0 && comparadores[signoPrecio]) {
            const filtradas = stockEntrante.filter(recomendacion =>
                comparadores[signoPrecio](parseFloat(recomendacion.costo), filtro)
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(stockEntrante.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(stockEntrante.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (stockEntrante.length > 0) {
            setDatosFiltrados(stockEntrante.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [stockEntrante, paginaActual, cantidadProductosMostrables]);

    const handleModalClose = () => {
        setShowDetallesStock(false);
        setMostrarStocks(true);
        buscarStocks();
    };

    const handleMostrarDetalles = (detalles: DetalleStock[]) => {
        setSelectedDetalles(detalles);
        setShowDetallesStock(true);
        setMostrarStocks(false);
    };


    return (
        <div className="opciones-pantallas">
            <h1>- Stock entrante -</h1>

            <ModalCrud isOpen={showDetallesStock} onClose={handleModalClose}>
                <DetallesStock detallesOriginal={selectedDetalles} />
            </ModalCrud>

            <div className="filtros">
                <div className="inputBox-filtrado">
                    <select id="cantidad" name="cantidadProductos" value={cantidadProductosMostrables} onChange={(e) => cantidadDatosMostrables(parseInt(e.target.value))}>
                        <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="filtros-datos">
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="date"
                            required
                            onChange={(e) => filtrarFechas(e.target.value, '')}
                        />
                        <span>Filtrar por fecha inicial</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="date"
                            required
                            onChange={(e) => filtrarFechas('', e.target.value)}
                        />
                        <span>Filtrar por fecha final</span>
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="number"
                            required
                            onChange={(e) => filtrarPrecio(parseInt(e.target.value))}
                        />
                        <span>Filtrar por precio</span>
                        <select name="signo" value={signoPrecio} onChange={(e) => setSignoPrecio(e.target.value)}>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                            <option value="=">=</option>
                        </select>
                    </div>
                </div>


            </div>

            {mostrarStocks && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Costo total</th>
                                <th>Detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(stock => (
                                <tr key={stock.id}>
                                    <td>{formatDate(new Date(stock.fechaLlegada.toString()))}</td>
                                    <td>${stock.costo}</td>
                                    <td className="detalle-stock-entrante" onClick={() => handleMostrarDetalles(stock.detallesStock)}><button className="btn-accion-detalle">VER DETALLE</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: paginasTotales }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} disabled={paginaActual === index + 1}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default StocksEntregado
