import { useEffect, useState } from "react";
import { Carrito } from "../types/Carrito";
import { Cliente } from "../types/Cliente";




const Pago = () => {

    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);

    useEffect(() => {
        const clienteString = localStorage.getItem('usuario');
        let cliente: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(cliente);

        cargarPedido();

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
            <div>
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
                        value={cliente?.domicilio}
                        placeholder="Ingresa tu domicilio"
                        hidden
                    />
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre menu</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito && carrito.productos.map((producto, index) => (
                            <tr className="item-pago" key={index}>
                                <td><img src={producto.menu.imagenes[0].ruta} alt="" /></td>
                                <td><p>{producto.menu.nombre}</p></td>
                                <td><p>{carrito.productos[index].cantidad}</p></td>
                                <td><p>{carrito.productos[index].cantidad * carrito.productos[index].menu.precio}</p></td>
                            </tr>
                        ))}

                        <h3>Total: {carrito?.totalPrecio}</h3>
                    </tbody>
                </table>

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
