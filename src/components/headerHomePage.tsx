import { useEffect, useState } from 'react';
import '../styles/homePage-header-footer.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Carrito } from '../types/Pedidos/Carrito';
import { CarritoService } from '../services/CarritoService';
import { Cliente } from '../types/Cliente/Cliente';
import { toast, Toaster } from 'sonner';
import { getBaseUrl, limpiarCredenciales } from '../utils/global_variables/const';
import { Empleado } from '../types/Restaurante/Empleado';
import { Sucursal } from '../types/Restaurante/Sucursal';

interface HeaderHomePageProps {
    scrolled: boolean;
}

const HeaderHomePage: React.FC<HeaderHomePageProps> = ({ scrolled }) => {

    /*HEADER FUNCTIONS */

    const [isCartOpen, setIsCartOpen] = useState(false); // Estado para controlar la visibilidad del carrito
    const [isAccountOpen, setIsAccountOpen] = useState(false); // Estado para controlar la visibilidad de la ventana de preferencias de cuenta
    const navigate = useNavigate();
    const [cliente, setCliente] = useState<Cliente | Sucursal | Empleado | null>(null);
    const { id } = useParams();

    useEffect(() => {
        cargarUsuario();
    }, []);

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');
        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        const empleadoString = localStorage.getItem('empleado');
        const sucursalString = localStorage.getItem('sucursal');

        if (clienteString !== null) {
            let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();
            setCliente(clienteMem);
        } else if (empleadoString !== null) {
            let clienteMem: Empleado = empleadoString ? JSON.parse(empleadoString) : new Empleado();
            setCliente(clienteMem);
        } else if (sucursalString !== null) {
            let clienteMem: Sucursal = sucursalString ? JSON.parse(sucursalString) : new Sucursal();
            setCliente(clienteMem);
        }
    }

    const handleLoginClick = () => {
        navigate('/login-cliente')
    };

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen); // Alterna la visibilidad del carrito
        setIsAccountOpen(false);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
        setIsAccountOpen(false);
    };

    const handleAccountClick = () => {
        // Muestra la ventana de preferencias de cuenta
        setIsAccountOpen(!isAccountOpen);
        setIsCartOpen(false);
    };

    const handleLogout = () => {
        limpiarCredenciales();
        setCliente(null)
    };

    const handleEditarPerfilClick = () => {
        navigate('/cliente', { state: { opcionSeleccionada: 4 } });
    };

    const handleEditarDomiciliosClick = () => {
        navigate('/cliente', { state: { opcionSeleccionada: 3 } });
    };

    const handlePedidosClick = () => {
        navigate('/cliente', { state: { opcionSeleccionada: 2 } });
    };

    const [carrito, setCarrito] = useState<Carrito>(new Carrito());

    useEffect(() => {
        let interval = setInterval(() => {
            cargarCarrito();
        }, 99);

        return () => clearInterval(interval);
    }, []);

    async function cargarCarrito() {
        setCarrito(await CarritoService.getCarrito());
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString('es-AR');
    };

    const [comidaBuscada, setComidaBuscada] = useState<string>('');

    function buscarProducto() {
        if (comidaBuscada.length > 0) {
            window.location.href = `${getBaseUrl()}/busqueda/${comidaBuscada}`;
        } else {
            toast.info('Debe colocar algún nombre para realizar la búsqueda')
        }
    }

    return (
        <header id='inicio' className={`header ${scrolled ? 'scrolled' : ''}`}>
            <Toaster />
            <div className="menu container">
                <a onClick={() => window.location.href = getBaseUrl()} className="logo"><img src="../src/assets/img/HatchfulExport-All/logo_transparent_header.png" alt="" /></a>

                <input type="checkbox" id="menu" />
                <label htmlFor="menu">
                    <img src="../src/assets/icons/header-icono-responsive.png" className="menu-icono-responsive" alt="menu" />
                </label>
                <nav className="navbar">
                    <input type="text" className='search-input' placeholder='¿Que deseas comer hoy?' onChange={(e) => setComidaBuscada(e.target.value)} />
                    <img className='menu-icono-search' src="../src/assets/icons/header-icono-busqueda.png" alt="Carrito" onClick={handleCartClick} />

                    <ul>
                        <li><a href={`/${id ?? 1}/#inicio`}>Inicio</a></li>
                        <li><a href={`/${id ?? 1}/#servicios`}>Nosotros</a></li>
                        <li><a href={`/${id ?? 1}/#ofertas`}>Promociones</a></li>
                        <li><a href={`/${id ?? 1}/#menus`}>Menús</a></li>
                        <li><a href={`/${id ?? 1}/#contactos`}>Contactos</a></li>

                    </ul>
                    <ul>
                        {cliente && cliente?.id > 0 ? (
                            <>
                                <>
                                    {carrito && carrito?.totalProductos > 0 && (
                                        <span className="cart-item-count" onClick={handleCartClick}>{carrito?.totalProductos}</span>
                                    )}
                                </>
                                <img className='menu-icono' src="../src/assets/icons/header-icono-carrito.png" alt="Carrito" onClick={handleCartClick} />
                                <li style={{ cursor: 'pointer' }} className="text-replacement" onClick={handleCartClick}><a>Carrito</a></li>

                                <img className='menu-icono' src="../src/assets/icons/header-icono-cuenta.png" alt="Cuenta" onClick={handleAccountClick} />

                                <li style={{ cursor: 'pointer' }} className="text-replacement" onClick={handleAccountClick}><a>Cuenta: {cliente.nombre ? cliente.nombre : cliente.email}</a></li>


                                {isCartOpen && location.pathname !== `${getBaseUrl()}/pago` && (
                                    <div className="cart-dropdown">
                                        <h4>Carrito de compras</h4>
                                        <button className="close-cart" onClick={handleCloseCart}>X<strong>(cerrar)</strong></button>
                                        {carrito && carrito?.totalProductos === 0 ? (
                                            <p className="empty-cart-message">NO HAY ARTÍCULOS EN EL CARRITO</p>
                                        ) : (
                                            <>
                                                {carrito?.articuloMenu?.map((item) => (
                                                    <div key={item.id} className="cart-item">
                                                        <button className="remove-item" onClick={() => CarritoService.borrarProducto(item.nombre)}>X</button>
                                                        <p id="name-item">{item.nombre}</p>
                                                        <p id="price-item"><strong>Precio unitario:&nbsp;</strong>${formatPrice(item.precioVenta)}</p>
                                                        <p id="price-item"><strong>Precio:&nbsp;</strong>${formatPrice(item.precioVenta * item.cantidad)}</p>
                                                        <div className="quantity-controls">
                                                            <p>Cantidad:&nbsp;</p>
                                                            <button
                                                                className={item.cantidad === 1 ? 'disabled' : ''}
                                                                onClick={() => CarritoService.descontarAlCarrito(item, null, 1)}
                                                                disabled={item.cantidad === 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span>{item.cantidad}</span>
                                                            <button onClick={() => CarritoService.agregarAlCarrito(item, null, 1)}>+</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {carrito?.articuloVenta && carrito?.articuloVenta?.length > 0 && (
                                                    carrito?.articuloVenta?.map((item) => (
                                                        <div key={item.id} className="cart-item">
                                                            <button className="remove-item" onClick={() => CarritoService.borrarProducto(item.nombre)}>X</button>
                                                            <p id="name-item">{item.nombre}</p>
                                                            <p id="price-item"><strong>Precio unitario:&nbsp;</strong>${formatPrice(item.precioVenta)}</p>
                                                            <p id="price-item"><strong>Precio:&nbsp;</strong>${formatPrice(item.precioVenta * item.cantidad)}</p>
                                                            <div className="quantity-controls">
                                                                <p>Cantidad:&nbsp;</p>
                                                                <button
                                                                    className={item.cantidad === 1 ? 'disabled' : ''}
                                                                    onClick={() => CarritoService.descontarAlCarrito(null, item, 1)}
                                                                    disabled={item.cantidad === 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span>{item.cantidad}</span>
                                                                <button onClick={() => CarritoService.agregarAlCarrito(null, item, 1)}>+</button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                                {carrito?.promociones && carrito?.promociones?.length > 0 && (
                                                    carrito?.promociones?.map((item) => (
                                                        <div key={item.id} className="cart-item">
                                                            <button className="remove-item" onClick={() => CarritoService.borrarProducto(item.nombre)}>X</button>
                                                            <p id="name-item">{item.nombre}</p>
                                                            <p id="price-item"><strong>Precio unitario:&nbsp;</strong>${formatPrice(item.precio)}</p>
                                                            <p id="price-item"><strong>Precio:&nbsp;</strong>${formatPrice(item.precio * item.cantidad)}</p>
                                                            <div className="quantity-controls">
                                                                <p>Cantidad:&nbsp;</p>
                                                                <button
                                                                    className={item.cantidad === 1 ? 'disabled' : ''}
                                                                    onClick={() => CarritoService.descontarPromocionAlCarrito(item, 1)}
                                                                    disabled={item.cantidad === 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span>{item.cantidad}</span>
                                                                <button onClick={() => CarritoService.incrementarPromocionAlCarrito(item, 1)}>+</button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </>
                                        )}
                                        {carrito && carrito?.totalProductos > 0 && (
                                            <div className="cart-total">
                                                <p><strong>Precio final: </strong>${formatPrice(carrito?.totalPrecio)}</p>
                                                <button style={{ marginRight: '20px', color: 'red' }} className="finalizar-pedido" onClick={() => { setCarrito(new Carrito()); CarritoService.limpiarCarrito(); }}>Limpiar carrito</button>
                                                <Link to={`${getBaseUrl()}/pago`}>
                                                    <button style={{ color: 'green' }} className="finalizar-pedido">Finalizar pedido</button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {isAccountOpen && (
                                    <div className="account-dropdown">
                                        <h4>Preferencias de cuenta</h4>
                                        <button className="close-cart" onClick={handleCloseCart}>X<strong>(cerrar)</strong></button>
                                        <p className='nombre-email-usuario'>- {cliente.nombre ? cliente.nombre : cliente.email} -</p>

                                        <ul className="preferences-list">
                                            <li><button onClick={handleEditarPerfilClick}>Editar perfil</button></li>
                                            <li><button onClick={handleEditarDomiciliosClick}>Editar domicilios</button></li>
                                            <li><button onClick={handlePedidosClick}>Pedidos</button></li>
                                        </ul>
                                        <div className='button-logout-div'>
                                            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <li className='btn-iniciar-sesion'><a onClick={handleLoginClick}>Iniciar sesión</a></li>
                        )}
                        {sucursal && isAccountOpen && (
                            <div className="account-dropdown">
                                <h4>Preferencias de cuenta</h4>
                                <button className="close-cart" onClick={handleCloseCart}>
                                    X<strong>(cerrar)</strong>
                                </button>
                                <p className="nombre-email-usuario">- {sucursal.nombre} -</p>
                                <ul className="preferences-list">
                                    <li>
                                        <button onClick={() => window.location.href = getBaseUrl() + '/opciones'}>Opciones</button>
                                    </li>
                                    <li>
                                        <button onClick={() => window.location.href = getBaseUrl() + `/opciones/${1}`}>Pedidos entrantes</button>
                                    </li>
                                    <li>
                                        <button onClick={() => window.location.href = getBaseUrl() + `/opciones/${3}`}>Pedidos para entregar</button>
                                    </li>
                                </ul>
                                <div className="button-logout-div">
                                    <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
                                </div>
                            </div>
                        )}
                    </ul>
                </nav>
            </div>
            <div className="header-content container">
                <div className="header-txt">
                    <h1>&mdash; El Buen Sabor &mdash;</h1>
                    <p>¡Donde lo buenardo es rutina!</p>
                </div>
            </div>
        </header >
    );
}

export default HeaderHomePage;

