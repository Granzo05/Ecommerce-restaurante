import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedido';

const PedidosEntregados = () => {
    //EmpleadoService.checkUser('negocio');

    const [pedidosEntregados, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        PedidoService.getPedidos('entregados')
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);


    return (

        <div className="opciones-pantallas">
            <h1>Pedidos entregados</h1>
            <div id="pedidos">
                    {pedidosEntregados.map(pedido => (
                        <div key={pedido.id} className="grid-item">
                            {pedido.detallesPedido.map(detalle => (
                                <div>
                                    <h3>{detalle.menu.nombre}</h3>
                                    <h3>{detalle.cantidad}</h3>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
        </div >
    )
}

export default PedidosEntregados
