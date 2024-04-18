import { Link } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';
import { useEffect, useState } from 'react';
import UserLogo from '../assets/img/user-icon.png';
import CarritoComponent from './CarritoComponent';
import { Carrito } from '../types/Carrito';
import { CarritoService } from '../services/CarritoService';

const Header = () => {
    const [openLinks, setOpenLinks] = useState(false);

    const [carrito, setCarrito] = useState<Carrito>(new Carrito());

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
        const actualizarCarrito = async () => {
            try {     
                setCarrito(await CarritoService.getCarrito())
            } catch (error) {
                console.error('Error:', error);
            }
        };

        actualizarCarrito();
    }, []);

    function cerrarSesion() {
        localStorage.removeItem('usuario');
        window.location.reload();
    }

    function handleClickLogo() {
        window.location.href = '/';
    }


    /*
        function iniciarSesionPage() {
            window.location.href = '/login-cliente';
        }
    */

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
                            <CarritoComponent carritoActualizado={carrito}/>
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
