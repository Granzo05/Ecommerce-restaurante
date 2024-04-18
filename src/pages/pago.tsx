import { useEffect, useState } from "react";
import { Carrito } from "../types/Carrito";
import { Cliente } from "../types/Cliente";
import '../styles/pago.css';
import { ClienteService } from "../services/ClienteService";

const Pago = () => {

    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [domicilio, setDomicilio] = useState<string>();

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

    function enviarPedidoARestaurante(metodoPago: string) {
        alert(metodoPago);
    }

    function realizarPago() {
        // Logica para mercadopago
    }

    return (
        <div>
            <div className="div-pago">
                <div id="detalle-producto"></div>
                <select name="tipoEnvio" id="tipoEnvio">
                    <option value="DELIVERY">Delivery</option>
                    <option value="RETIRO">Retiro en tienda</option>
                </select>

                <h2>Detalles del domicilio</h2>
                <form>
                    <label id="domicilio">Domicilio:</label>
                    <input
                        type="text"
                        id="domicilioCliente"
                        name="domicilioCliente"
                        required
                        value={domicilio}
                        placeholder="Ingresa tu domicilio"
                        hidden
                    />
                </form>

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

                <h3>Total: {carrito?.totalPrecio}</h3>

                <section className="informacion-pago">
                    <button
                        type="submit"
                        onClick={() => enviarPedidoARestaurante('EFECTIVO')}
                        hidden
                        id="botonEncargo"
                    >
                        Realizar encargo
                    </button>
                    <button
                        type="submit"
                        hidden
                        id="checkout-btn"
                        onClick={realizarPago}
                    >
                        Pagar con MercadoPago
                    </button>
                </section>
            </div>
        </div>
    )
}

export default Pago
