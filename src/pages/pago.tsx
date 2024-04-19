import { useEffect, useState } from "react";
import { Carrito } from "../types/Carrito";
import { Cliente } from "../types/Cliente";
import '../styles/pago.css';
import { ClienteService } from "../services/ClienteService";
import { StockService } from "../services/StockService";
import { Pedido } from "../types/Pedido";
import { DetallePedido } from "../types/Detalles_pedido";
import { PedidoService } from "../services/PedidoService";

const Pago = () => {

    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [domicilio, setDomicilio] = useState<string | null>('');
    const [envio, setTipoEnvio] = useState<string>('DELIVERY');

    useEffect(() => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);

        cargarPedido();

        const buscarDomicilio = async () => {
            if (cliente) {
                setDomicilio(await ClienteService.getDomicilio(cliente.email));
            }
        }

        buscarDomicilio();
    }, []);

    function cargarPedido() {
        const carritoString = localStorage.getItem('carrito');
        let carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();

        setCarrito(carrito);
    }

    async function enviarPedidoARestaurante(tipoEnvio: string) {
        // Chequeamos que haya stock antes que nada

        let hayStock = true;

        for (const producto of carrito?.productos || []) {
            // Esta funcion devuelve un booleano, true en caso de haber stock y false caso contrario
            const stockProducto = await StockService.getStockProduct(producto.menu.nombre, producto.cantidad);
            if (!stockProducto) {
                hayStock = false;
                alert("No tenemos la cantidad necesaria para preparar: " + producto.menu.nombre)
                // Salimos si encontramos un producto sin stock
                break;
            }
        }

        if (hayStock) {
            let pedido = new Pedido();
            // Asignamos el cliente
            //if (cliente) pedido.cliente = cliente;

            // Asignamos la forma de pago
            pedido.tipoEnvio = tipoEnvio;

            // Creamos los detalles
            let detalles: DetallePedido[] = [];

            carrito?.productos.forEach(producto => {
                let detalle = new DetallePedido();
                detalle.menu = producto.menu;
                detalle.cantidad = producto.cantidad;
                detalle.subTotal = producto.cantidad * producto.menu.precio;

                detalles.push(detalle);
            });

            pedido.detalles = detalles;

            pedido.estado = 'entrantes';

            // Realizar el envío del pedido
            let response = await PedidoService.crearPedido(pedido);

            alert(response);
        } else {
            console.error('No hay suficiente stock para completar el pedido');
        }
    }


    function realizarPago() {
        // Logica para mercadopago
    }

    return (
        <div className="container-pago">
            <div className="div-pago">
                <div id="detalle-producto"></div>
                <select name="tipoEnvio" id="tipoEnvio" onChange={e => setTipoEnvio(e.target.value)}>
                    <option value="DELIVERY">Delivery</option>
                    <option value="RETIRO">Retiro en tienda</option>
                </select>

                <h2>Detalles del domicilio</h2>

                {domicilio ? (
                    <p>Domicilio: {domicilio}</p>
                ) : (
                    <input
                        type="text"
                        id="domicilioCliente"
                        name="domicilioCliente"
                        required
                        placeholder="Ingresa tu domicilio"
                    />
                )}


                <div className="productos">
                    {carrito && carrito.productos.map((producto, index) => (
                        <div className="item-pago" key={index}>
                            <img src={producto.menu.imagenes[0].ruta} alt="" />
                            <p>{producto.menu.nombre}</p>
                            <p>{carrito.productos[index].cantidad}</p>
                            <p>{carrito.productos[index].cantidad * carrito.productos[index].menu.precio}</p>
                        </div>
                    ))}
                </div>


                {envio === 'DELIVERY' ? (
                    <div className="total">
                        <h3>Total: ${carrito?.totalPrecio}</h3>

                        <button
                            type="submit"
                            id="checkout-btn"
                            onClick={realizarPago}
                        >
                            Pagar con MercadoPago
                        </button>
                    </div>

                ) : (
                    <div>
                        {carrito?.totalPrecio && (
                            <h3>Total: ${carrito.totalPrecio * 0.9}</h3>
                        )}
                        <p>*Retiro en tienda con 10% de descuento</p>
                        <button
                            type="submit"
                            onClick={() => enviarPedidoARestaurante('TIENDA')}
                            id="botonEncargo"
                        >
                            Realizar encargo
                        </button>
                    </div>

                )}
            </div>
        </div>
    )
}

export default Pago
