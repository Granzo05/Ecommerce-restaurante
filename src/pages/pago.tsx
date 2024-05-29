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
import { toast, Toaster } from "sonner";
import { Domicilio } from "../types/Domicilio/Domicilio";

const Pago = () => {
    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
    const [envio, setTipoEnvio] = useState<string>('DELIVERY');

    useEffect(() => {
        cargarPedido();
        buscarDomicilio();
    }, []);

    const buscarDomicilio = async () => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);

        if (cliente) {
            try {
                ClienteService.getDomicilios(cliente?.id)
                    .then(data => {
                        setDomicilios(data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        }
    }

    function cargarPedido() {
        const carritoString = localStorage.getItem('carrito');
        let carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();

        setCarrito(carrito);
    }

    async function enviarPedidoARestaurante(tipoEnvio: EnumTipoEnvio) {
        let hayStock = true;

        if (hayStock) {
            let pedido = new Pedido();
            if (cliente) pedido.cliente = cliente;
            pedido.tipoEnvio = tipoEnvio;

            let detalles: DetallesPedido[] = [];
            carrito?.articuloMenu.forEach(producto => {
                let detalle = new DetallesPedido();
                detalle.articuloMenu = producto;
                detalle.cantidad = producto.cantidad;
                detalle.subTotal = producto.cantidad * producto.precioVenta;
                detalles.push(detalle);
            });

            pedido.factura = null;
            pedido.detallesPedido = detalles;
            pedido.estado = EnumEstadoPedido.ENTRANTES;

            toast.promise(PedidoService.crearPedido(pedido), {
                loading: 'Creando pedido...',
                success: (message) => {
                    localStorage.removeItem('carrito');
                    return message;
                },
                error: (message) => {
                    return message;
                },
            });

        } else {
            console.error('No hay suficiente stock para completar el pedido');
        }
    }

    function realizarPago() {
        // Logica para mercadopago
    }

    useEffect(() => {
        document.title = 'Detalle del pedido y pago';
      }, []);

    return (
        <>
        <div className="container-pago">
            <Toaster />
            <div className="div-pago">
                <div id="detalle-producto"></div>
                <label style={{fontWeight: 'bold', color: '#2C2C2C'}}>Tipo de entrega:</label>
                <select className="tipo-envio" name="tipoEnvio" id="tipoEnvio" onChange={e => setTipoEnvio(e.target.value)}>
                    <option value="DELIVERY">Delivery</option>
                    <option value="RETIRO">Retiro en tienda</option>
                </select>
                <hr />
                <h2>Detalles del pedido</h2>

                {envio === 'DELIVERY' && (
                    domicilios && domicilios.length > 0 && (
                        <select id="domicilioSeleccionado" name="domicilioSeleccionado">
                            {domicilios.map((domicilio, index) => (
                                <option key={index} value={domicilio.calle}>
                                    {domicilio.calle}
                                </option>
                            ))}
                        </select>
                    )
                )}

                <div className="productos">
                    {carrito && carrito.articuloMenu.map((producto, index) => (
                        <div className="item-pago" key={index}>
                            {producto.imagenesDTO[0] && (
                                <img src={producto.imagenesDTO[0].ruta} alt={producto.nombre} />
                            )}
                            <p>{producto.nombre}</p>
                            <p>Cantidad: {carrito.articuloMenu[index].cantidad}</p>
                            <p>Subtotal: ${carrito.articuloMenu[index].cantidad * carrito.articuloMenu[index].precioVenta}</p>
                        </div>
                    ))}
                    {carrito && carrito.articuloVenta.map((producto, index) => (
                        <div className="item-pago" key={index}>
                            {producto.imagenesDTO[0] && (
                                <img src={producto.imagenesDTO[0].ruta} alt={producto.nombre} />
                            )}
                            <p>{producto.nombre}</p>
                            <p >Cantidad: {carrito.articuloVenta[index].cantidad}</p>
                            <p>Subtotal: ${carrito.articuloVenta[index].cantidad * carrito.articuloVenta[index].precioVenta}</p>
                        
                        </div>
                    ))}
                    <hr />
                </div>

                {envio === 'DELIVERY' ? (
                    <div className="total">
                        <h2>Total: ${carrito?.totalPrecio}</h2>

                        <button
                            type="submit"
                            className="checkout-btn"
                            onClick={realizarPago}
                        >
                            Pagar con MercadoPago
                        </button>
                        <button
                            type="submit"
                            className="cancelar-btn"
                        >
                            Cancelar pedido
                        </button>
                    </div>

                ) : (
                    <div className="total">
                        {carrito?.totalPrecio && (
                            <h2>Total: ${carrito.totalPrecio * 0.9}</h2>
                        )}
                        <p>*Retiro en tienda con 10% de descuento</p>
                        <button
                            type="submit"
                            className="checkout-btn"
                            onClick={() => enviarPedidoARestaurante(EnumTipoEnvio.TIENDA)}
                        >
                            Realizar encargo
                        </button>
                        <button
                            type="submit"
                            className="cancelar-btn"
                        >
                            Cancelar pedido
                        </button>
                    </div>
                )}
            </div>
        </div >
        </>
    )
}

export default Pago;
