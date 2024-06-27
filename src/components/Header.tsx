import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png';
import { useEffect, useState } from 'react';
import '../styles/header.css';
import { Carrito } from '../types/Pedidos/Carrito';
import { CarritoService } from '../services/CarritoService';
import { Cliente } from '../types/Cliente/Cliente';
import { toast, Toaster } from 'sonner';
import { getBaseUrl, getBaseUrlCliente, limpiarCredenciales } from '../utils/global_variables/const';
import { Sucursal } from '../types/Restaurante/Sucursal';
import searchIcon from '../assets/icons/header-icono-busqueda.png'
import cartIcon from '../assets/icons/header-icono-carrito.png';
import accountIcon from '../assets/icons/header-icono-cuenta.png';
import responsiveIcon from '../assets/icons/header-icono-responsive.png'

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false); // Estado para controlar la visibilidad del carrito
    const [isAccountOpen, setIsAccountOpen] = useState(false); // Estado para controlar la visibilidad de la ventana de preferencias de cuenta
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');
        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    useEffect(() => {
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);
    }

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
        setIsAccountOpen(false);
    };

    const handleLoginClick = () => {
        navigate('/login-cliente')
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
        setIsAccountOpen(false);
        setCliente(null)
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

    const location = useLocation();

    const [comidaBuscada, setComidaBuscada] = useState<string>('');

    function buscarProducto() {
        if (comidaBuscada.length > 0) {
            window.location.href = `${getBaseUrl()}/busqueda/${comidaBuscada}`;
        } else {
            toast.info('Debe colocar algún nombre para realizar la búsqueda')
        }
    }

    const handleEditarPerfilClick = () => {
        window.location.href = getBaseUrlCliente() + `/cliente/opciones/${4}`
    };

    const handleEditarDomiciliosClick = () => {
        window.location.href = getBaseUrlCliente() + `/cliente/opciones/${3}`
    };

    const handlePedidosClick = () => {
        window.location.href = getBaseUrlCliente() + `/cliente/opciones/${2}`
    };

    return (
        <header id="inicio" className="header-all">
            <Toaster />
            <div className="menu container">
                <a onClick={() => window.location.href = getBaseUrl()} style={{ cursor: 'pointer' }} className="logo"><img src={Logo} alt="" /></a>

                <input type="checkbox" id="menu" />
                <label htmlFor="menu">
                    <img src={responsiveIcon} className="menu-icono-responsive" alt="menu" />
                </label>

                <nav className="navbar">
                    <input type="text" className='search-input' placeholder='¿Que deseas comer hoy?' onChange={(e) => setComidaBuscada(e.target.value)} />
                    <img className='menu-icono-search' src={searchIcon} alt="Carrito" onClick={buscarProducto} />
                    <img
                        className='menu-icono-search-header-normal'
                        src="../../src/assets/icons/header-icono-busqueda.png"
                        alt="Carrito"
                        onClick={handleCartClick}
                        style={{ display: location.pathname !== ':id/pago' ? 'none' : 'block' }} // Ocultar ícono de búsqueda en /pago
                    />
                    <ul className='ul-header-all'>
                        <li><a href={`/${id ?? 1}/#inicio`}>Inicio</a></li>
                        <li><a href={`/${id ?? 1}/#servicios`}>Nosotros</a></li>
                        <li><a href={`/${id ?? 1}/#ofertas`}>Promociones</a></li>
                        <li><a href={`/${id ?? 1}/#menus`}>Menús</a></li>
                        <li><a href={`/${id ?? 1}/#contactos`}>Contactos</a></li>
                    </ul>
                    <ul>
                        {cliente && cliente?.email?.length > 0 ? (
                            <>
                                {location.pathname !== `${getBaseUrl()}/pago` && (
                                    <>
                                        {carrito && carrito?.totalProductos > 0 && (
                                            <span className="cart-item-count" onClick={handleCartClick}>
                                                {carrito?.totalProductos}
                                            </span>
                                        )}
                                        <img
                                            className={`menu-icono ${isCartOpen ? 'cart-icon-open' : ''}`}
                                            src={cartIcon}
                                            alt="Carrito"
                                            onClick={handleCartClick}
                                        />
                                        <li style={{ cursor: 'pointer' }} className="text-replacement" onClick={handleCartClick}>
                                            <a>Carrito</a>
                                        </li>
                                    </>
                                )}
                                <img
                                    className={`menu-icono ${isAccountOpen ? 'cart-icon-open' : ''}`}
                                    src={accountIcon}
                                    alt="Cuenta"
                                    onClick={handleAccountClick}
                                />
                                <li style={{ cursor: 'pointer' }} className="text-replacement" onClick={handleAccountClick}>
                                    <a>Cuenta: {cliente.nombre ? cliente.nombre : cliente.email}</a>
                                </li>

                                {isCartOpen && location.pathname !== `${getBaseUrl()}/pago` && (
                                    <div className="cart-dropdown">
                                        <h4>Carrito de compras</h4>
                                        <button className="close-cart" onClick={handleCloseCart}>
                                            X<strong>(cerrar)</strong>
                                        </button>
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
                                                            <button className="remove-item" onClick={() => CarritoService.borrarPromocion(item.nombre)}>X</button>
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
                                                <button
                                                    style={{ marginRight: '20px', backgroundColor: 'red' }}
                                                    className="finalizar-pedido"
                                                    onClick={() => {
                                                        setCarrito(new Carrito());
                                                        CarritoService.limpiarCarrito();
                                                    }}
                                                >
                                                    Limpiar carrito
                                                </button>
                                                <Link to={`${getBaseUrl()}/pago`}>
                                                    <button style={{ backgroundColor: 'green' }} className="finalizar-pedido">Finalizar pedido</button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {isAccountOpen && (

                                    <div className="account-dropdown">
                                        <h4>Preferencias de cuenta</h4>
                                        <button className="close-cart" onClick={handleCloseCart}>
                                            X<strong>(cerrar)</strong>
                                        </button>
                                        <p className="nombre-email-usuario">- {cliente.nombre ? cliente.nombre : cliente.email} -</p>
                                        <ul className="preferences-list">
                                            <li><button onClick={handleEditarPerfilClick}>Editar perfil</button></li>
                                            <li><button onClick={handleEditarDomiciliosClick}>Editar domicilios</button></li>
                                            <li><button onClick={handlePedidosClick}>Pedidos</button></li>
                                        </ul>
                                        <div className="button-logout-div">
                                            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <li className="btn-iniciar-sesion">
                                <a onClick={handleLoginClick}>Iniciar sesión</a>
                            </li>
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
        </header >
    );
}

export default Header;
