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
import { StockArticuloVentaService } from "../services/StockArticulosService";
import { StockIngredientesService } from "../services/StockIngredientesService";
import { ArticuloVenta } from "../types/Productos/ArticuloVenta";
import { ArticuloMenu } from "../types/Productos/ArticuloMenu";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useLocation } from "react-router-dom";
import { CarritoService } from "../services/CarritoService";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Pago = () => {
    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [domicilio, setDomicilio] = useState<Domicilio>();
    const [envio, setTipoEnvio] = useState<EnumTipoEnvio>(EnumTipoEnvio.RETIRO_EN_TIENDA);
    const [isVisible, setIsVisible] = useState(false);
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [modalBusquedaDomicilio, setModalBusquedaDomicilio] = useState<boolean>(false);

    // Con esto podemos verificar si el pedido vuelve luego de un fallo en mercadopago para eliminarlo
    let query = useQuery();

    const preference = query.get('preference_id');

    useEffect(() => {
        // Preference que se capta en caso de ser un pago fallido, el cual vuelve acá. Por lo tanto borramos el pedido que no se va a realizar
        if (preference && preference.length > 0) {
            PedidoService.eliminarPedidoFallido(preference);
            setPreferenceId('');
        }
    }, [preference]);


    const handleModalClose = () => {
        setModalBusquedaDomicilio(false)
    };

    useEffect(() => {
        if (preferenceId) {
            initMercadoPago("TEST-41b327fc-a375-4756-a0af-e30b0344a817", {
                locale: "es-AR",
            });

            if (preferenceId && preferenceId !== "") {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }

    }, [preferenceId]);

    useEffect(() => {
        cargarPedido();
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
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
        let productoFaltante: ArticuloMenu | ArticuloVenta | null = null;

        // Verificar stock de ArticuloMenu
        if (carrito?.articuloMenu) {
            for (const producto of carrito.articuloMenu) {
                for (const ingrediente of producto.ingredientesMenu) {
                    hayStock = await StockIngredientesService.checkStock(ingrediente.id, ingrediente.medida.id, producto.cantidad);

                    if (!hayStock) {
                        productoFaltante = producto;
                        break;
                    }
                }
                if (!hayStock) break;
            }
        }

        // Verificar stock de ArticuloVenta
        if (hayStock && carrito?.articuloVenta) {
            for (const articulo of carrito.articuloVenta) {
                hayStock = await StockArticuloVentaService.checkStock(articulo.id, articulo.cantidad);

                if (!hayStock) {
                    productoFaltante = articulo;
                    break;
                }
            }
        }

        if (cliente && cliente?.email?.length > 0) {

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

                if (preferenceId) {
                    console.log(preferenceId)
                    PedidoService.eliminarPedidoFallido(preferenceId);
                }

                toast.promise(PedidoService.crearPedido(pedido), {
                    loading: 'Creando pedido...',
                    success: (message) => {
                        CarritoService.limpiarCarrito();
                        return message;
                    },
                    error: (message) => {
                        return message;
                    },
                });
            } else {
                toast.error('Lo sentimos, no hay suficiente stock de: ' + (productoFaltante?.nombre ?? 'producto desconocido'));
            }
        } else {
            toast.error('Debe estar logueado para realizar su pedido');
        }
    }


    async function crearPreferencia(domicilio: Domicilio) {
        if (envio === 0) {
            let hayStock = true;
            let productoFaltante: ArticuloMenu | ArticuloVenta | null = null;

            // Verificar stock de ArticuloMenu
            if (carrito?.articuloMenu) {
                for (const producto of carrito.articuloMenu) {
                    for (const ingrediente of producto.ingredientesMenu) {
                        hayStock = await StockIngredientesService.checkStock(ingrediente.id, ingrediente.medida.id, producto.cantidad);

                        if (!hayStock) {
                            productoFaltante = producto;
                            break;
                        }
                    }
                    if (!hayStock) break;
                }
            }

            // Verificar stock de ArticuloVenta
            if (hayStock && carrito?.articuloVenta) {
                for (const articulo of carrito.articuloVenta) {
                    hayStock = await StockArticuloVentaService.checkStock(articulo.id, articulo.cantidad);

                    if (!hayStock) {
                        productoFaltante = articulo;
                        break;
                    }
                }
            }

            if (cliente && cliente?.email?.length > 0) {
                if (hayStock) {
                    if (preferenceId === null && domicilio) {
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
                        pedido.borrado = 'NO';

                        pedido.domicilioEntrega = domicilio;

                        let preference = await PedidoService.crearPedidoMercadopago(pedido);

                        setPreferenceId(preference.id);
                    } else {
                        setPreferenceId(preferenceId);
                    }
                } else {
                    toast.error('Lo sentimos, no hay suficiente stock de: ' + (productoFaltante?.nombre ?? 'producto desconocido'));
                }
            } else {
                toast.error('Debe estar logueado para realizar su pedido');
            }
        }

    }

    useEffect(() => {
        document.title = 'Detalle del pedido y pago';
    }, []);

    return (
        <>
            <Header />
            <div className="container-pago">
                <Toaster />
                <div className="div-pago">

                    <h3>&mdash; Detalle del pedido y pago &mdash;</h3>
                    <div id="detalle-producto"></div>
                    <label style={{ fontWeight: 'bold', color: '#2C2C2C', fontSize: '18px' }}>Tipo de entrega:</label>
                    <select className="tipo-envio" value={envio} name="tipoEnvio" id="tipoEnvio" onChange={e => setTipoEnvio(parseInt(e.target.value))}>
                        <option value={EnumTipoEnvio.DELIVERY}>Delivery</option>
                        <option value={EnumTipoEnvio.RETIRO_EN_TIENDA}>Retiro en tienda</option>
                    </select>
                    <hr />
                    <label style={{ fontWeight: 'bold', color: '#2C2C2C', fontSize: '18px' }}>Domicilio a entregar:</label>
                    {envio === EnumTipoEnvio.DELIVERY && (
                        <>
                            <InputComponent placeHolder='Seleccionar domicilio...' onInputClick={() => setModalBusquedaDomicilio(true)} selectedProduct={domicilio?.calle ?? ''} disabled={false} />
                            {modalBusquedaDomicilio && <ModalFlotanteRecomendacionesDomicilios onCloseModal={handleModalClose} onSelectedDomicilio={(domicilio) => { setDomicilio(domicilio); handleModalClose(); crearPreferencia(domicilio) }} cliente={cliente} />}

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


                    {envio === EnumTipoEnvio.DELIVERY ? (
                        <div className="total">
                            <h2><strong>Total:</strong> ${carrito?.totalPrecio}</h2>

                            {domicilio && domicilio?.calle?.length > 0 ? (
                                <div className={isVisible ? "divVisible" : "divInvisible"}>
                                    {preferenceId && preferenceId.length > 2 && (
                                        <Wallet
                                            initialization={{ preferenceId: preferenceId, redirectMode: "blank" }}
                                            customization={{ texts: { valueProp: "smart_option" } }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <p>El botón de pago se mostrará una vez que se asigne un domicilio de entrega</p>
                            )}

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
            <Footer />
        </>
    )
}

export default Pago;

