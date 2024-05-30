import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { MenuService } from '../services/MenuService'
import ModalFlotante from '../components/ModalFlotante';
import { DetallesMenu } from '../components/Menus/DetallesMenu';
import '../styles/menuPorTipo.css'
import { ArticuloMenu } from '../types/Productos/ArticuloMenu';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png';
import '../styles/header.css';


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function RestaurantesPorComida(this: any) {
  const { tipoComida } = useParams()

  const [menus, setMenus] = useState<ArticuloMenu[]>([]);

  useEffect(() => {
    if (tipoComida) {
      MenuService.getMenusPorTipo(tipoComida)
        .then(menus => {
          setMenus(menus);
        })
        .catch(error => {
          console.error("Error al obtener los menús:", error);
        });
    }
  }, [tipoComida]);

  const [showDetailsMenu, setShowDetailsMenuModal] = useState(false);

  const handleMostrarMenu = () => {
    setShowDetailsMenuModal(true);
  };

  const handleModalClose = () => {
    setShowDetailsMenuModal(false);
  };

  useEffect(() => {
    document.title = 'Menú - ' + tipoComida;
  }, []);

  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

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

    const location = useLocation(); // Obtiene la ruta actual


  return (
    <>
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
                        {location.pathname !== '/pago' && (
                            <>
                                {getTotalItems() > 0 && (
                                    <span className="cart-item-count" onClick={handleCartClick}>{getTotalItems()}</span>
                                )}
                                <img className={`menu-icono-all ${isCartOpen ? 'cart-icon-open' : ''}`} src="../src/assets/icons/header-icono-carrito.png" alt="Carrito" onClick={handleCartClick} />
                            </>
                        )}
                        <img className={`menu-icono-all ${isAccountOpen ? 'cart-icon-open' : ''}`} src="../src/assets/icons/header-icono-cuenta.png" alt="Cuenta" onClick={handleAccountClick} />
                        {isCartOpen && location.pathname !== '/pago' && (
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
      <div className='menu-tipo'>
        <div className="heading">
          <h1>Menú</h1>
          <h3>&mdash;{tipoComida}&mdash;</h3>
        </div>



        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>{tipoComida}</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>





      </div>
    </>


  );

}

export default RestaurantesPorComida;

/*<div id="grid-container">
      {menus.length > 0 && menus.map((menu) => (
        <div key={menu.id} className="grid-item" onClick={handleMostrarMenu} style={{ width: '300px' }}>
          {menu.imagenesDTO.length > 0 && (
            <img key={menu.imagenesDTO[0].nombre} src={menu.imagenesDTO[0].ruta} alt={menu.imagenesDTO[0].nombre} />
          )}
          <h2>{menu.nombre}</h2>
          <h2>${menu.precioVenta}</h2>
          <h2>Descripción: {menu.descripcion}</h2>
          <h2><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
            <path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 15 8 L 15 17 L 22 17 L 22 15 L 17 15 L 17 8 Z"></path>
          </svg>{menu.tiempoCoccion} minutos</h2>

          <ModalFlotante isOpen={showDetailsMenu} onClose={handleModalClose}>
            <DetallesMenu menuActual={menu} />
          </ModalFlotante>
        </div>
      ))
      }
    </div > */