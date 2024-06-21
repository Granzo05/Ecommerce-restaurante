import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { EnumTipoEnvio } from '../../types/Pedidos/EnumTipoEnvio';
import FacturaIMG from '../../assets/icons/facturas.png'
import { FacturaService } from '../../services/FacturaService';

const PedidosEntregados = () => {
    const [pedidosEntregados, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.ENTREGADOS)
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function descargarFactura(idPedido: number) {
        await FacturaService.getPdfFactura(idPedido);
    }


    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<Pedido[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > pedidosEntregados.length) {
            setPaginasTotales(1);
            setDatosFiltrados(pedidosEntregados);
        } else {
            setPaginasTotales(Math.ceil(pedidosEntregados.length / cantidad));
            setDatosFiltrados(pedidosEntregados.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarCliente(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = pedidosEntregados.filter(recomendacion =>
                recomendacion.cliente.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(pedidosEntregados.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(pedidosEntregados.length / cantidadProductosMostrables));
        }
    }

    function filtrarEnvio(filtro: number) {
        if (filtro > 0) {
            const filtradas = pedidosEntregados.filter(recomendacion =>
                recomendacion.tipoEnvio === filtro
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(pedidosEntregados.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(pedidosEntregados.length / cantidadProductosMostrables));
        }
    }

    function filtrarMenus(filtro: string) {
        if (filtro.length > 0) {
            let filtradas = pedidosEntregados.filter(recomendacion =>
                recomendacion.detallesPedido.some(detalle =>
                    detalle.articuloMenu?.nombre.toLowerCase().includes(filtro.toLowerCase())
                )
            );

            if (filtradas.length === 0) {
                filtradas = pedidosEntregados.filter(recomendacion =>
                    recomendacion.detallesPedido.some(detalle =>
                        detalle.articuloVenta?.nombre.toLowerCase().includes(filtro.toLowerCase())
                    )
                );
            }

            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(pedidosEntregados.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(pedidosEntregados.length / cantidadProductosMostrables));
        }
    }

    return (

        <div className="opciones-pantallas">
            <h1>- Pedidos entregados -</h1>
            <hr />

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
                            type="text"
                            required
                            onChange={(e) => filtrarCliente(e.target.value)}
                        />
                        <span>Filtrar por cliente</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <select name="" id="" onChange={(e) => filtrarEnvio(parseInt(e.target.value))}>
                            <option value={0}>Seleccionar tipo de envío</option>
                            <option value={EnumTipoEnvio.DELIVERY}>DELIVERY</option>
                            <option value={EnumTipoEnvio.RETIRO_EN_TIENDA}>Retiro en tienda</option>
                        </select>
                        <span>Filtrar por tipo de envío</span>
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarMenus(e.target.value)}
                        />
                        <span>Filtrar por menú</span>
                    </div>
                </div>
            </div>

            <div id="pedidos">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Tipo de envío</th>
                            <th>Factura de la compra</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosFiltrados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>
                                    <div>
                                        <p>{pedido.cliente?.nombre}</p>
                                        <p>{pedido.cliente?.telefono}</p>
                                        <p>{pedido.cliente?.email}</p>
                                    </div>
                                </td>
                                {pedido.tipoEnvio === EnumTipoEnvio.DELIVERY ? (
                                    <td>
                                        <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</p>
                                    </td>
                                ) : (
                                    <td>
                                        <p>{pedido.tipoEnvio?.toString().replace(/_/g, ' ')}</p>
                                        <p>{pedido.domicilioEntrega?.calle} {pedido.domicilioEntrega?.numero} {pedido.domicilioEntrega?.localidad?.nombre}</p>
                                    </td>

                                )}
                                <td onClick={() => descargarFactura(pedido.id)}><img src={FacturaIMG} alt="logo de factura" /></td>
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
        </div >
    )
}

export default PedidosEntregados
