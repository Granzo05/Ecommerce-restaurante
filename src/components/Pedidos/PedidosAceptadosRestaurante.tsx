import { useEffect, useState } from 'react';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedido';
import { EmpleadoService } from '../../services/EmpleadoService';

const PedidosAceptados = () => {
    const [pedidosAceptados, setPedidos] = useState<Pedido[]>([]);

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

        PedidoService.getPedidos('aceptados')
            .then(data => {
                setPedidos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    function handleFinalizar(idPedido: number) {
        console.log(idPedido)
    }

    return (

        <div className="opciones-pantallas">
            <h1>Pedidos aceptados</h1>
            <div id="pedidos">
                {pedidosAceptados.map(pedido => (
                    <div key={pedido.id} className="grid-item">
                        {pedido.detalles.map(detalle => (
                            <div>
                                <h3>{detalle.menu.nombre}</h3>
                                <h3>{detalle.cantidad}</h3>
                            </div>
                        ))}
                        <button onClick={() => handleFinalizar(pedido.id)}>Finalizado</button>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default PedidosAceptados
