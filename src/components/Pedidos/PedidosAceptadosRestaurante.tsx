import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedidos/Pedido';
import { EnumEstadoPedido } from '../../types/Pedidos/EnumEstadoPedido';
import { toast, Toaster } from 'sonner';
import ModalCrud from '../ModalCrud';
import DetallesPedido from './DetallesPedido';

const PedidosAceptados = () => {
    const [PedidosAceptados, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
        PedidoService.getPedidos(EnumEstadoPedido.ACEPTADOS)
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function handleFinalizarPedido(pedido: Pedido) {
        toast.promise(PedidoService.updateEstadoPedido(pedido, EnumEstadoPedido.COCINADOS), {
            loading: 'Enviando pedido al administrador...',
            success: (message) => {
                buscarPedidos();
                return message;
            },
            error: (message) => {
                return message;
            },
        });
    }

    const [showDetallesPedido, setShowDetallesPedido] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<Pedido>(new Pedido());

    const handleModalClose = () => {
        setShowDetallesPedido(false);
    };

    const [paginaActual, setPaginaActual] = useState(0);
    const [productosMostrables, setProductosMostrables] = useState<number>(10);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * productosMostrables;
    const indexPrimerProducto = indexUltimoProducto + productosMostrables;

    // Obtener los elementos de la página actual
    const pedidosFiltrados = PedidosAceptados.slice(indexUltimoProducto, indexPrimerProducto);

    const paginasTotales = Math.ceil(PedidosAceptados.length / productosMostrables);

    // Cambiar de página
    const paginate = (paginaActual: number) => setPaginaActual(paginaActual);

    return (

        <div className="opciones-pantallas">
            <Toaster />
            <h1>- Pedidos aceptados -</h1>
            <hr />
            <ModalCrud isOpen={showDetallesPedido} onClose={handleModalClose}>
                <DetallesPedido pedido={selectedPedido} />
            </ModalCrud>
            <div id="pedidos">
                <select name="cantidadProductos" value={10} onChange={(e) => setProductosMostrables(parseInt(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                </select>
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de envío</th>
                            <th>Menu</th>
                            <th>Finalizar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.tipoEnvio.toString().replace(/_/g, ' ')}</td>
                                <td onClick={() => { setSelectedPedido(pedido); setShowDetallesPedido(true) }}>
                                    {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                                        <div key={detalle.id}>
                                            <p>{detalle.cantidad} - {detalle.articuloMenu?.nombre}{detalle.articuloVenta?.nombre} </p>
                                        </div>
                                    ))}
                                </td>
                                <td><button onClick={() => handleFinalizarPedido(pedido)}>Finalizar</button></td>
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

export default PedidosAceptados
