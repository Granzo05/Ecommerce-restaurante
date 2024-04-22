import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { PedidoService } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedido';

const PedidosEntrantes = () => {
    EmpleadoService.checkUser('negocio');

    const [pedidosEntrantes, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await EmpleadoService.checkUser('negocio');
            } catch (error) {
                console.error('Error:', error);
            }
        };

        //fetchData();

        PedidoService.getPedidos('entrantes')
            .then(data => {
                setPedidos(data);
                console.log(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    function handleAceptarPedido(idPedido: number) {
        // Modificar estado de pantalla del cliente donde vea que el negocio acepto el pedido, podria
        // usar la condicional de estado 'aceptado' para ir variando las imagenes que se le muestran al cliente en su pedido

        PedidoService.enviarPedidoACocina(idPedido);
        alert("Pedido aceptado")
    }

    function handleRechazarPedido(idPedido: number) {
        PedidoService.rechazarPedido(idPedido);
        alert("Pedido rechazado")
    }

    return (

        <div className="opciones-pantallas">
            <h1>Pedidos entrantes</h1>
            <div id="pedidos">
                {pedidosEntrantes.map(pedido => (
                    <div key={pedido.id} className="grid-item">
                        {pedido && pedido.detallesPedido && pedido.detallesPedido.map(detalle => (
                            <div key={detalle.id}>
                                <h3>{detalle.menu.nombre}</h3>
                                <h3>{detalle.cantidad}</h3>
                            </div>
                        ))}
                        <button onClick={() => handleAceptarPedido(pedido.id)}>Aceptar</button>
                        <button onClick={() => handleRechazarPedido(pedido.id)}>Rechazar</button>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default PedidosEntrantes
