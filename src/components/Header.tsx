import { Link } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';
import { useEffect, useState } from 'react';
import UserLogo from '../assets/img/user-icon.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { Carrito } from '../types/Carrito';

const Header = () => {
    const [openLinks, setOpenLinks] = useState(false);

    const [carrito, setCarrito] = useState<Carrito | null>(null);

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };

    // Esto verifica si la sesion esta iniciada
    let creden = true;

    if (localStorage.getItem('usuario')) {
        creden = false;
    }

    //const [showLink, setShowLink] = useState(false);

    useEffect(() => {
        /*
        const fetchData = async () => {
            try {
                // Esto retorna true o false
                const result = await RestauranteService.checkPrivilegies();

                setShowLink(result); // Se setea para chequear en el div si se puede mostrar en caso de ser true

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
*/

        cargarCarrito();
    }, []);

    function cargarCarrito() {
        const carritoString = localStorage.getItem('carrito');
        let carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();
        setCarrito(carrito);
    }

    function handleFinalizarPedido() {
        if (carrito) {
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
        window.location.href = '/pago';
    }


    function cerrarSesion() {
        localStorage.removeItem('usuario');
        window.location.reload();
    }

    function handleClickLogo() {
        window.location.href = '/';
    }

    function iniciarSesionPage() {
        window.location.href = '/login-cliente';
    }

    function eliminarProducto(index: number) {
        setCarrito(prevCarrito => {
            const newCarrito = new Carrito();
            if (prevCarrito) {
                newCarrito.menu = prevCarrito.menu.filter((_, i) => i !== index);
                newCarrito.cantidad = prevCarrito.cantidad.filter((_, i) => i !== index);
                newCarrito.precio = prevCarrito.precio.filter((_, i) => i !== index);
                newCarrito.imagenSrc = prevCarrito.imagenSrc.filter((_, i) => i !== index);
                newCarrito.totalProductos = prevCarrito.totalProductos - 1;
                newCarrito.totalPrecio = prevCarrito.totalPrecio - prevCarrito.precio[index];
            }

            localStorage.setItem('carrito', JSON.stringify(newCarrito));

            return newCarrito;
        });

        cargarCarrito();
    }

    return (
        <header>
            <div className='navbar'>
                <div className='leftSide' id={openLinks ? "open" : "close"}>
                    <img id='logo-header' src={Logo} onClick={handleClickLogo} />
                    <div className="hiddenLinks">
                        <Link to="/"> Inicio </Link>
                        <Link to="/menu"> Menú </Link>
                        <Link to="/about"> Sobre nosotros </Link>
                        <Link to="/contact"> Contáctanos </Link>
                    </div>
                </div>
                <div className='rightSide'>
                    <Link to="/" id='inicio'>Inicio</Link>
                    <Link to="/" id='menu'>Menú</Link>
                    <Link to="/" id='about'>Sobre nosotros</Link>
                    <button onClick={cerrarSesion}>Cerrar sesión</button>

                    <Link to="/opciones" id='opciones'>Opciones</Link>

                    <button className='icono-responsive' onClick={toggleNavbar}><ReorderIcon /></button>
                    <div className='cuenta'>
                        {creden && (
                            <button className='iniciar-sesion' onClick={iniciarSesionPage}>Iniciar sesión</button>
                        )}
                        {!creden && (
                            <div className='mi-cuenta'>
                                <button onClick={() => cargarCarrito()} id='carrito' style={{ background: 'none', border: 'none', color: 'white', margin: '20px', position: 'relative' }}><ShoppingCartIcon style={{ display: 'block' }} /><label id='contador-carrito'>{carrito?.totalProductos}</label></button>
                                <div className="container-cart-products hidden-cart">
                                    <div className="container-cart-products">
                                        {carrito && carrito.menu.length === 0 && (
                                            <div className="container-empty-cart">
                                                <p>El carrito está vacío</p>
                                                <button style={{ background: 'none', border: 'none', color: 'black' }} className='icon-close'><CloseIcon /></button>
                                            </div>
                                        )}
                                        <button id='carrito' style={{ background: 'none', border: 'none', color: 'black', margin: '50px', position: 'relative', marginTop: '20px', marginLeft: '5px' }}>
                                            <ShoppingCartIcon style={{ display: 'block' }} />
                                            <label id='contador-carrito'>{carrito?.totalProductos}</label>
                                        </button>
                                        <button style={{ background: 'none', border: 'none', color: 'black', marginLeft: '300px', padding: '15px' }} className='icon-close'><CloseIcon /></button>

                                        {carrito && carrito.menu.map((item, index) => (
                                            <div className="cart-product" key={index}>
                                                <div className="info-cart-product">
                                                    <img src={item.imagenes[0].ruta} alt="" />
                                                    <span className='cantidad-producto-carrito'>{carrito.cantidad[index]}</span>
                                                    <span className='titulo-producto-carrito'>{item.nombre}</span>
                                                    <span className='precio-producto-carrito'>{item.precio}</span>
                                                    <span onClick={() => eliminarProducto(index)}>X</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="cart-total">
                                            <h3>Total:</h3>
                                            <span className='total-pagar'>{carrito?.totalPrecio}</span>

                                        </div>

                                        <button onClick={handleFinalizarPedido} className='finalizar-pedido-button'>Finalizar pedido</button>

                                    </div>

                                </div>
                                <button id='cuenta' style={{ background: 'none', border: 'none', color: 'white' }}><img src={UserLogo} alt="" style={{ width: '50px', cursor: 'pointer' }} /></button>
                            </div>)}
                    </div>
                </div>
            </div>
        </header>

    )

}

export default Header;