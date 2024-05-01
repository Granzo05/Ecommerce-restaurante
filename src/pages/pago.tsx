import { useEffect, useState } from "react";
import { Carrito } from "../types/Pedidos/Carrito";
import { Cliente } from "../types/Cliente/Cliente";
import '../styles/pago.css';
import { ClienteService } from "../services/ClienteService";
import { Pedido } from "../types/Pedidos/Pedido";
import { PedidoService } from "../services/PedidoService";
import { EnumTipoEnvio } from "../types/Pedidos/EnumTipoEnvio";
import { DetallesPedido } from "../types/Pedidos/Detalles_pedido";
import { EnumEstadoPedido } from "../types/Pedidos/EnumEstadoPedido";
import { StockIngredientesService } from "../services/StockIngredientesService";
import { StockArticuloVentaService } from "../services/StockArticulosService";

const Pago = () => {

    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [domicilio, setDomicilio] = useState<string | null>('');
    const [envio, setTipoEnvio] = useState<string>('DELIVERY');

    useEffect(() => {
        cargarPedido();

        const buscarDomicilio = async () => {
            const clienteString = localStorage.getItem('usuario');
            let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

            setCliente(clienteMem);

            if (cliente) {
                setDomicilio(await ClienteService.getDomicilio(cliente.email));
            }
        }

        buscarDomicilio();
    }, [cliente]);

    function cargarPedido() {
        const carritoString = localStorage.getItem('carrito');
        let carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();

        setCarrito(carrito);
    }

    async function enviarPedidoARestaurante(tipoEnvio: EnumTipoEnvio) {
        // Chequeamos que haya stock antes que nada

        let hayStock = true;

        for (const producto of carrito?.articuloMenu || []) {
            // Esta funcion devuelve un booleano, true en caso de haber stock y false caso contrario
            const stockProducto = await StockIngredientesService.getStockProduct(producto.nombre, producto.cantidad);

            if (!stockProducto.match('El stock es suficiente')) {
                hayStock = false;
                alert(stockProducto)
                // Salimos si encontramos un producto sin stock
                break;
            }
        }

        for (const producto of carrito?.articuloVenta || []) {
            // Esta funcion devuelve un booleano, true en caso de haber stock y false caso contrario
            const stockProducto = await StockArticuloVentaService.getStockProduct(producto.nombre, producto.cantidad);

            if (!stockProducto.match('El stock es suficiente')) {
                hayStock = false;
                alert(stockProducto)
                // Salimos si encontramos un producto sin stock
                break;
            }
        }

        if (hayStock) {
            let pedido = new Pedido();
            // Asignamos el cliente
            if (cliente) pedido.cliente = cliente;

            // Asignamos la forma de pago
            pedido.tipoEnvio = tipoEnvio;

            // Creamos los detalles
            let detalles: DetallesPedido[] = [];

            carrito?.articuloMenu.forEach(producto => {
                let detalle = new DetallesPedido();
                detalle.articuloMenu = producto;
                detalle.cantidad = producto.cantidad;
                detalle.subTotal = producto.cantidad * producto.precioVenta;

                detalles.push(detalle);
            });

            carrito?.articuloVenta.forEach(producto => {
                let detalle = new DetallesPedido();
                detalle.articuloVenta = producto;
                detalle.cantidad = producto.cantidad;
                detalle.subTotal = producto.cantidad * producto.precioVenta;

                detalles.push(detalle);
            });

            pedido.factura = null;

            pedido.detallesPedido = detalles;
            pedido.estado = EnumEstadoPedido.ENTRANTES;

            // Realizar el envío del pedido
            let response = await PedidoService.crearPedido(pedido);

            alert(response);

            localStorage.removeItem('carrito');

            //window.location.href = Pagina de muestra de tiempo y eso

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
                    {carrito && carrito.articuloMenu.map((producto, index) => (
                        <div className="item-pago" key={index}>
                            <img src={producto.imagenes[0].ruta} alt="" />
                            <p>{producto.nombre}</p>
                            <p>{carrito.articuloMenu[index].cantidad}</p>
                            <p>{carrito.articuloMenu[index].cantidad * carrito.articuloMenu[index].precioVenta}</p>
                        </div>
                    ))}
                    {carrito && carrito.articuloVenta.map((producto, index) => (
                        <div className="item-pago" key={index}>
                            <img src={producto.imagenes[0].ruta} alt="" />
                            <p>{producto.nombre}</p>
                            <p>{carrito.articuloVenta[index].cantidad}</p>
                            <p>{carrito.articuloVenta[index].cantidad * carrito.articuloVenta[index].precioVenta}</p>
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
                            onClick={() => enviarPedidoARestaurante(EnumTipoEnvio.TIENDA)}
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
