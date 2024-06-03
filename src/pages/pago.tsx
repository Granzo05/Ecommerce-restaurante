import { useEffect, useState } from "react";
import { Carrito } from "../types/Pedidos/Carrito";
import { Cliente } from "../types/Cliente/Cliente";
import '../styles/pago.css';
import { Pedido } from "../types/Pedidos/Pedido";
import { PedidoService } from "../services/PedidoService";
import { EnumTipoEnvio } from "../types/Pedidos/EnumTipoEnvio";
import { DetallesPedido } from "../types/Pedidos/Detalles_pedido";
import { EnumEstadoPedido } from "../types/Pedidos/EnumEstadoPedido";
import { toast, Toaster } from "sonner";
import { Domicilio } from "../types/Domicilio/Domicilio";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InputComponent from "../components/InputFiltroComponent";
import ModalFlotanteRecomendacionesDomicilios from "../hooks/ModalFlotanteFiltroDomicilios";

const Pago = () => {
    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [domicilio, setDomicilio] = useState<Domicilio>();
    const [envio, setTipoEnvio] = useState<EnumTipoEnvio | string>(EnumTipoEnvio.DELIVERY);

    const [modalBusquedaDomicilio, setModalBusquedaDomicilio] = useState<boolean>(false);


    const handleModalClose = () => {
        setModalBusquedaDomicilio(false)
    };

    useEffect(() => {
        cargarPedido();
        buscarDomicilio();
    }, []);

    const buscarDomicilio = async () => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);
    }

    function cargarPedido() {
        const carritoString = localStorage.getItem('carrito');
        let carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();

        setCarrito(carrito);
    }

    async function enviarPedidoARestaurante() {
        let hayStock = true;

        if (hayStock) {
            let pedido = new Pedido();
            if (cliente) pedido.cliente = cliente;
            pedido.tipoEnvio = envio;

            let detalles: DetallesPedido[] = [];

            carrito?.articuloMenu?.forEach(producto => {
                let detalle = new DetallesPedido();
                detalle.articuloMenu = producto;
                detalle.cantidad = producto.cantidad;
                detalle.subTotal = producto.cantidad * producto.precioVenta;
                detalles.push(detalle);
            });

            carrito?.articuloVenta?.forEach(producto => {
                let detalle = new DetallesPedido();
                detalle.articuloVenta = producto;
                detalle.cantidad = producto.cantidad;
                detalle.subTotal = producto.cantidad * producto.precioVenta;
                detalles.push(detalle);
            });

            pedido.factura = null;
            pedido.detallesPedido = detalles;
            pedido.estado = EnumEstadoPedido.ENTRANTES;
            pedido.borrado = 'NO';

            if (envio === EnumTipoEnvio.RETIRO_EN_TIENDA) {
                pedido.domicilioEntrega = null;
            }

            toast.promise(PedidoService.crearPedido(pedido), {
                loading: 'Creando pedido...',
                success: (message) => {
                    //localStorage.removeItem('carrito');
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
            <Header></Header>
            <div className="container-pago">
                <Toaster />
                <div className="div-pago">

                    <h3>&mdash; Detalle del pedido y pago &mdash;</h3>
                    <div id="detalle-producto"></div>
                    <label style={{ fontWeight: 'bold', color: '#2C2C2C', fontSize: '18px' }}>Tipo de entrega:</label>
                    <select className="tipo-envio" name="tipoEnvio" id="tipoEnvio" onChange={e => setTipoEnvio(e.target.value)}>
                        <option value={EnumTipoEnvio.DELIVERY}>Delivery</option>
                        <option value={EnumTipoEnvio.RETIRO_EN_TIENDA}>Retiro en tienda</option>
                    </select>
                    <hr />
                    <label style={{ fontWeight: 'bold', color: '#2C2C2C', fontSize: '18px' }}>Domicilio a entregar:</label>
                    {envio === EnumTipoEnvio.DELIVERY && (
                        <>
                            <InputComponent placeHolder='Seleccionar domicilio...' onInputClick={() => setModalBusquedaDomicilio(true)} selectedProduct={domicilio?.calle ?? ''} disabled={false} />
                            {modalBusquedaDomicilio && <ModalFlotanteRecomendacionesDomicilios onCloseModal={handleModalClose} onSelectedDomicilio={(domicilio) => { setDomicilio(domicilio); handleModalClose(); }} cliente={cliente} />}

                        </>
                    )}
                    <hr />
                    <label style={{ fontWeight: 'bold', color: '#2C2C2C', fontSize: '18px' }}>Detalles del pedido:</label>


                    <div className="productos">
                        {carrito && carrito.articuloMenu.map((producto, index) => (
                            <div className="item-pago" key={index}>
                                {producto?.imagenes[0] && (
                                    <img src={producto?.imagenes[0]?.ruta} alt={producto?.nombre} />
                                )}
                                <p className="name-product">{producto.nombre}</p>
                                <div className="cant-sub">
                                    <p className="cant-product"><strong>Cantidad:</strong> {carrito.articuloMenu[index].cantidad}</p>
                                    <p className="subtotal-product"><strong>Subtotal:</strong> ${carrito.articuloMenu[index].cantidad * carrito.articuloMenu[index].precioVenta}</p>

                                </div>
                            </div>
                        ))}
                        {carrito && carrito.articuloVenta.map((producto, index) => (
                            <div className="item-pago" key={index}>
                                {producto?.imagenes[0] && (
                                    <img src={producto?.imagenes[0]?.ruta} alt={producto?.nombre} />
                                )}
                                <p className="name-product">{producto.nombre}</p>
                                <div className="cant-sub">
                                    <p className="cant-product"><strong>Cantidad:</strong> {carrito.articuloVenta[index].cantidad}</p>
                                    <p className="subtotal-product"><strong>Subtotal:</strong> ${carrito.articuloVenta[index].cantidad * carrito.articuloVenta[index].precioVenta}</p>

                                </div>

                            </div>
                        ))}
                        <hr />
                    </div>


                    {envio === 'DELIVERY' ? (
                        <div className="total">
                            <h2><strong>Total:</strong> ${carrito?.totalPrecio}</h2>

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
                                <h2><strong>Total:</strong> ${Math.ceil(carrito.totalPrecio * 0.9)}</h2>
                            )}
                            <p style={{ color: '#007bff' }}>*Retiro en tienda con 10% de descuento</p>
                            <button
                                type="submit"
                                className="checkout-btn"
                                onClick={() => enviarPedidoARestaurante()}
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
            <Footer></Footer>
        </>
    )
}

export default Pago;
