import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png';
import { useEffect, useState } from 'react';
import '../styles/header.css';
import { Carrito } from '../types/Pedidos/Carrito';
import { CarritoService } from '../services/CarritoService';
import { Cliente } from '../types/Cliente/Cliente';

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false); // Estado para controlar la visibilidad del carrito
    const [isAccountOpen, setIsAccountOpen] = useState(false); // Estado para controlar la visibilidad de la ventana de preferencias de cuenta
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);
    }

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen); // Alterna la visibilidad del carrito
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
        localStorage.removeItem('usuario');
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

    const location = useLocation(); // Obtiene la ruta actual

    return (
        <header id="inicio" className="header-all">
            <div className="menu container">
                <a href="/" className="logo">
                    <img src={Logo} alt="Logo" />
                </a>
                <input type="checkbox" id="menu" />
                <label htmlFor="menu">
                    <img src="../src/assets/icons/header-icono-responsive.png" className="menu-icono" alt="menu" />
                </label>
                <nav className="navbar">
                    <ul className='ul-header-all'>
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="/#servicios">Nosotros</a></li>
                        <li><a href="/#ofertas">Promociones</a></li>
                        <li><a href="/#menus">Menús</a></li>
                        <li><a href="#contactos">Contactos</a></li>
                    </ul>
                    <ul>
                        {cliente && cliente?.email.length > 0 ? (
                            <>
                                {
                                    location.pathname !== '/pago' && (
                                        <>
                                            {carrito && carrito?.totalProductos > 0 && (
                                                <span className="cart-item-count" onClick={handleCartClick}>{carrito?.totalProductos}</span>
                                            )}
                                            <img className={`menu-icono-all ${isCartOpen ? 'cart-icon-open' : ''}`} src="../src/assets/icons/header-icono-carrito.png" alt="Carrito" onClick={handleCartClick} />
                                        </>
                                    )
                                }
                                < img className={`menu-icono-all ${isAccountOpen ? 'cart-icon-open' : ''}`} src="../src/assets/icons/header-icono-cuenta.png" alt="Cuenta" onClick={handleAccountClick} />
                                {isCartOpen && location.pathname !== '/pago' && (
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
                                                        <p id="price-item"><strong>Precio:&nbsp;</strong>${formatPrice(item.precioVenta)}</p>
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
                                                            <p id="price-item"><strong>Precio:&nbsp;</strong>${formatPrice(item.precioVenta)}</p>
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
                                            </>
                                        )}
                                        {carrito && carrito?.totalProductos > 0 && (
                                            <div className="cart-total">
                                                <p><strong>Precio final: </strong>${carrito?.totalPrecio}</p>
                                                <button className="finalizar-pedido" onClick={() => { setCarrito(new Carrito()); CarritoService.limpiarCarrito(); }}>Limpiar carrito</button>
                                                <Link to="/pago">
                                                    <button className="finalizar-pedido">Finalizar pedido</button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {isAccountOpen && (
                                    <div className="account-dropdown">
                                        <h4>Preferencias de cuenta</h4>
                                        <button className="close-cart" onClick={handleCloseCart}>X<strong>(cerrar)</strong></button>
                                        <ul className="preferences-list">
                                            <li><button>Editar perfil</button></li>
                                            <li><button>Editar domicilios</button></li>
                                            <li><button>Pedidos</button></li>
                                        </ul>
                                        <div className="button-logout-div">
                                            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
                                        </div>
                                    </div>
                                )

                                }
                            </>
                        ) : (
                            <li className='btn-iniciar-sesion'><a onClick={handleLoginClick}>Iniciar sesión</a></li>
                        )}

                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
