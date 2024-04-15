import { Link } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';
import { useEffect, useState } from 'react';
import UserLogo from '../assets/img/user-icon.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { RestauranteService } from '../services/RestauranteService';

const Header = () => {
    const [openLinks, setOpenLinks] = useState(false);

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };

    let creden = true;

    if (localStorage.getItem('usuario')) {
        creden = false;
    }

    const [showLink, setShowLink] = useState(false);

    useEffect(() => {
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
    }, []);

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
                {showLink && (
                    <Link to="/opciones" id='opciones'>Opciones</Link>
                )}
                <button className='icono-responsive' onClick={toggleNavbar}><ReorderIcon /></button>
                <div className='cuenta'>
                    {creden && (
                        <button className='iniciar-sesion' onClick={iniciarSesionPage}>Iniciar sesión</button>
                    )}
                    {!creden && (
                        <div className='mi-cuenta'>
                            <button id='carrito' style={{ background: 'none', border: 'none', color: 'white', margin: '20px', position: 'relative' }}><ShoppingCartIcon style={{ display: 'block' }} /><label id='contador-carrito'>0</label></button>
                            <div className="container-cart-products hidden-cart">
                                <div className="cart-product">
                                    <div className="info-cart-product">
                                        <span className='cantidad-producto-carrito'>1</span>
                                        <p className='titulo-producto-carrito'>Hamburguesa</p>
                                        <span className='precio-producto-carrito'>$4.600</span>
                                    </div>
                                    <button style={{ background: 'none', border: 'none', color: 'black' }} className='icon-close'><CloseIcon /></button>
                                </div>
                                <div className="cart-total">
                                    <h3>Total:</h3>
                                    <span className='total-pagar'>$4.600</span>
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