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
import { useLocation, useParams } from "react-router-dom";
import { CarritoService } from "../services/CarritoService";
import { SucursalService } from "../services/SucursalService";
import { SucursalDTO } from "../types/Restaurante/SucursalDTO";
import ModalCrud from "../components/ModalCrud";

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

    const { id } = useParams()

    const [sucursal, setSucursal] = useState<SucursalDTO>(new SucursalDTO());

    useEffect(() => {
        if (id)
            SucursalService.getSucursalDTOById(parseInt(id))
                .then(async sucursal => {
                    if (sucursal) {
                        setSucursal(sucursal);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
    }, [id]);


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

    async function cargarPedido() {
        setCarrito(await CarritoService.getCarrito());
    }

    async function enviarPedidoARestaurante() {
        const now = new Date();
        const horaActual = now.toTimeString().slice(0, 5);

        if (sucursal.horarioApertura < horaActual && sucursal.horarioCierre > horaActual) {
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

                    carrito?.promociones?.forEach(promocion => {
                        promocion.detallesPromocion.forEach(detallePromo => {
                            if (detallePromo.articuloMenu && detallePromo.articuloMenu.nombre.length > 0) {
                                let detalle = new DetallesPedido();
                                detalle.articuloMenu = detallePromo.articuloMenu;
                                detalle.cantidad = detallePromo.cantidad;

                                // Aplicar el descuento correctamente
                                let precioConDescuento = detallePromo.articuloMenu.precioVenta * (1 - promocion.descuento);
                                detalle.subTotal = precioConDescuento * detallePromo.cantidad;

                                detalles.push(detalle);
                            } else if (detallePromo.articuloVenta && detallePromo.articuloVenta.nombre.length > 0) {
                                let detalle = new DetallesPedido();
                                detalle.articuloVenta = detallePromo.articuloVenta;
                                detalle.cantidad = detallePromo.cantidad;

                                // Aplicar el descuento correctamente
                                let precioConDescuento = detallePromo.articuloVenta.precioVenta * (1 - promocion.descuento);
                                detalle.subTotal = precioConDescuento * detallePromo.cantidad;

                                detalles.push(detalle);
                            }
                        });
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
        } else {
            toast.info(`El local está cerrado, el horario de atención es entre las ${sucursal.horarioApertura} y las ${sucursal.horarioCierre}`);
        }
    }


    async function crearPreferencia(domicilio: Domicilio) {
        const now = new Date();
        const horaActual = now.toTimeString().slice(0, 5);
        if (sucursal.horarioApertura < horaActual && sucursal.horarioCierre > horaActual) {
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

                            carrito?.promociones?.forEach(promocion => {
                                promocion.detallesPromocion.forEach(detallePromo => {
                                    if (detallePromo.articuloMenu && detallePromo.articuloMenu.nombre.length > 0) {
                                        let detalle = new DetallesPedido();
                                        detalle.articuloMenu = detallePromo.articuloMenu;
                                        detalle.cantidad = detallePromo.cantidad;

                                        // Aplicar el descuento correctamente
                                        let precioConDescuento = detallePromo.articuloMenu.precioVenta * (1 - promocion.descuento);
                                        detalle.subTotal = precioConDescuento * detallePromo.cantidad;

                                        detalles.push(detalle);
                                    } else if (detallePromo.articuloVenta && detallePromo.articuloVenta.nombre.length > 0) {
                                        let detalle = new DetallesPedido();
                                        detalle.articuloVenta = detallePromo.articuloVenta;
                                        detalle.cantidad = detallePromo.cantidad;

                                        // Aplicar el descuento correctamente
                                        let precioConDescuento = detallePromo.articuloVenta.precioVenta * (1 - promocion.descuento);
                                        detalle.subTotal = precioConDescuento * detallePromo.cantidad;

                                        detalles.push(detalle);
                                    }
                                });
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
        } else {
            toast.info(`El local está cerrado, el horario de atención es entre las ${sucursal.horarioApertura} y las ${sucursal.horarioCierre}`);
        }

    }

    useEffect(() => {
        document.title = 'Detalle del pedido y pago';
    }, []);

    const [showExitModal, setShowExitModal] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string; }) => {
                event.preventDefault();
                event.returnValue = ''; // Este mensaje no se muestra en todos los navegadores
                setShowExitModal(true);
                return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [carrito]);

    const handleExitConfirm = () => {
        setShowExitModal(false);
        window.location.href = '/'; // Redirigir al usuario a la página de inicio o a otra página
    };

    const handleExitCancel = () => {
        setShowExitModal(false);
    };
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
                            {modalBusquedaDomicilio && <ModalFlotanteRecomendacionesDomicilios datosOmitidos={domicilio?.calle ?? ''} onCloseModal={handleModalClose} onSelectedDomicilio={(domicilio) => { setDomicilio(domicilio); handleModalClose(); crearPreferencia(domicilio) }} cliente={cliente} />}

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
                        {carrito && carrito.promociones.map((producto, index) => (
                            <div className="item-pago" key={index}>
                                {producto?.imagenes[0] && (
                                    <img src={producto?.imagenes[0]?.ruta} alt={producto?.nombre} />
                                )}
                                <p className="name-product">{producto.nombre}</p>
                                <div className="cant-sub">
                                    <p className="cant-product"><strong>Cantidad:</strong> {carrito.promociones[index].cantidad}</p>
                                    <p className="subtotal-product"><strong>Subtotal:</strong> ${carrito.promociones[index].cantidad * carrito.promociones[index].precio}</p>
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
            <Footer sucursal={sucursal} />
            {/* Modal de confirmación de salida */}
            {showExitModal && (
                <ModalCrud
                    isOpen={showExitModal}
                    onClose={handleExitCancel}
                >
                    
                    <div className="modal-info">
                    <h2>Si sales ahora, perderás todos los productos agregados al carrito. ¿Deseas continuar?</h2>
                        <button onClick={handleExitConfirm}>Sí, salir</button>
                        <br />
                        <br />
                        <button onClick={handleExitCancel}>No, quedarse</button>
                    </div>
                </ModalCrud>
            )}
        </>
    )
}

export default Pago;

