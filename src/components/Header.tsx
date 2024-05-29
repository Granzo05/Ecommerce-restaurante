import { Link } from 'react-router-dom';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png';
import ReorderIcon from '@mui/icons-material/Reorder';
import { useEffect, useState } from 'react';
import '../styles/header.css';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false); // Estado para controlar la visibilidad del carrito
    const [isAccountOpen, setIsAccountOpen] = useState(false); // Estado para controlar la visibilidad de la ventana de preferencias de cuenta

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
        // Cierra la sesión
        setIsAccountOpen(false); // Oculta la ventana de preferencias de cuenta al cerrar sesión
    };

    // PRUEBA CARRITO
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        // Ejemplo de elementos en el carrito
        setCartItems([
            { id: 1, name: 'Pizza', price: 6000, quantity: 1 },
            { id: 2, name: 'Hamburguesa', price: 4000, quantity: 1 },
            { id: 3, name: 'Sushi', price: 10000, quantity: 1 },
        ]);
    }, []);

    const formatPrice = (price: number) => {
        return price.toLocaleString('es-AR');
    };

    const increaseQuantity = (id: number) => {
        setCartItems(cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const decreaseQuantity = (id: number) => {
        setCartItems(cartItems.map((item) =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const removeItem = (id: number) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const calculateTotal = () => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return total.toLocaleString('es-AR');
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <header id="inicio" className="header-all">
            <div className="menu container">
                <a href="" className="logo">
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
                        {getTotalItems() > 0 && (
                            <span className="cart-item-count" onClick={handleCartClick}>{getTotalItems()}</span>
                        )}
                        <img className={`menu-icono-all ${isCartOpen ? 'cart-icon-open' : ''}`} src="../src/assets/icons/header-icono-carrito.png" alt="Carrito" onClick={handleCartClick} />
                        <img className={`menu-icono-all ${isAccountOpen ? 'cart-icon-open' : ''}`} src="../src/assets/icons/header-icono-cuenta.png" alt="Cuenta" onClick={handleAccountClick} />
                        {isCartOpen && (
                            <div className="cart-dropdown">
                                <h4>Carrito de compras</h4>
                                <button className="close-cart" onClick={handleCloseCart}>X<strong>(cerrar)</strong></button>
                                {cartItems.length === 0 ? (
                                    <p className="empty-cart-message">NO HAY ARTÍCULOS EN EL CARRITO</p>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <button className="remove-item" onClick={() => removeItem(item.id)}>X</button>
                                            <p id="name-item">{item.name}</p>
                                            <p id="price-item"><strong>Precio:&nbsp;</strong>${formatPrice(item.price)}</p>
                                            <div className="quantity-controls">
                                                <p>Cantidad:&nbsp;</p>
                                                <button
                                                    className={item.quantity === 1 ? 'disabled' : ''}
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    disabled={item.quantity === 1}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => increaseQuantity(item.id)}>+</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {cartItems.length > 0 && (
                                    <div className="cart-total">
                                        <p><strong>Precio final: </strong>${calculateTotal()}</p>
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
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
