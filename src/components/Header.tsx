import { Link } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';
import { useEffect, useState } from 'react';
import UserLogo from '../assets/img/user-icon.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { Carrito } from '../types/Carrito';
import { CarritoService } from '../services/CarritoService';

const Header = () => {

    const [carritoAbierto, setCarritoAbierto] = useState(false);

    const [openLinks, setOpenLinks] = useState(false);

    const [carrito, setCarrito] = useState<Carrito | null>(null);

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };
    /*
        // Esto verifica si la sesion esta iniciada
        let creden = true;
    
        if (localStorage.getItem('usuario')) {
            creden = false;
        }
    
        //const [showLink, setShowLink] = useState(false);
    */
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

    function abrirCarrito() {
        cargarCarrito();
        setCarritoAbierto(true)
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

    function handleLimpiarCarrito() {
        CarritoService.limpiarCarrito();
        console.log(carrito);
        setCarritoAbierto(false);
        setCarrito(null);
    }

    /*
        function iniciarSesionPage() {
            window.location.href = '/login-cliente';
        }
    */

    async function eliminarProducto(menuNombre: string) {
        await CarritoService.borrarProducto(menuNombre)
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
                        <div className='mi-cuenta'>
                            <button onClick={() => abrirCarrito()} id='carrito' style={{ background: 'none', border: 'none', color: 'white', margin: '20px', position: 'relative' }}><ShoppingCartIcon style={{ display: 'block' }} /><label id='contador-carrito'>{carrito?.totalProductos}</label></button>
                            <div className={`container-cart-products ${carritoAbierto ? '' : 'hidden-cart'}`}>
                                <div className="container-cart-products">
                        
                                    <button id='carrito' style={{ background: 'none', border: 'none', color: 'black', margin: '50px', position: 'relative', marginTop: '20px', marginLeft: '5px' }}>
                                        <ShoppingCartIcon style={{ display: 'block' }} />
                                        <label id='contador-carrito'>{carrito?.totalProductos}</label>
                                    </button>
                                    <button style={{ background: 'none', border: 'none', color: 'black', marginLeft: '300px', padding: '15px' }} className='icon-close' onClick={() => setCarritoAbierto(false)}><CloseIcon /></button>
                                    {carrito && carrito.productos && carrito.productos.length === 0 && (
                                        <div className="container-empty-cart">
                                            <p>El carrito está vacío</p>
                                        </div>
                                    )}
                                    {carrito && carrito.productos && carrito.productos.map((producto, index) => (
                                        <div className="cart-product" key={index}>
                                            <div className="info-cart-product">
                                                <img src={producto.menu.imagenes[0].ruta} alt="" />
                                                <span className='cantidad-producto-carrito'>{carrito.productos[index].cantidad}</span>
                                                <span className='titulo-producto-carrito'>{producto.menu.nombre}</span>
                                                <span className='precio-producto-carrito'>{producto.menu.precio * producto.cantidad}</span>
                                                <span onClick={() => eliminarProducto(producto.menu.nombre)}>X</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="cart-total">
                                        <h3>Total:</h3>
                                        <span className='total-pagar'>{carrito?.totalPrecio}</span>

                                    </div>

                                    <button onClick={handleLimpiarCarrito} className='finalizar-pedido-button'>Limpiar carrito</button>
                                    <button onClick={handleFinalizarPedido} className='finalizar-pedido-button'>Finalizar pedido</button>

                                </div>

                            </div>
                            <button id='cuenta' style={{ background: 'none', border: 'none', color: 'white' }}><img src={UserLogo} alt="" style={{ width: '50px', cursor: 'pointer' }} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )

}

export default Header;

/*{creden && (
    <button className='iniciar-sesion' onClick={iniciarSesionPage}>Iniciar sesión</button>
)}
{!creden && ()}*/
