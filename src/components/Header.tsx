import { Link } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';
import { useEffect, useState } from 'react';
import UserLogo from '../assets/img/user-icon.png';
import CarritoComponent from './CarritoComponent';

const Header = () => {
    const [openLinks, setOpenLinks] = useState(false);
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
                    {creden ? (
                        <button className='iniciar-sesion' onClick={() => window.location.href = '/login-cliente'}>Iniciar sesión</button>
                    ) :
                        (
                            <div className='cuenta'>
                                <div className='mi-cuenta'>
                                    <CarritoComponent />
                                    <button id='cuenta' style={{ background: 'none', border: 'none', color: 'white' }}><img src={UserLogo} alt="" style={{ width: '50px', cursor: 'pointer' }} /></button>
                                </div>
                                <button onClick={cerrarSesion}>Cerrar sesión</button>

                            </div>

                        )}

                    <Link to="/opciones" id='opciones'>Opciones</Link>

                    <button className='icono-responsive' onClick={toggleNavbar}><ReorderIcon /></button>

                </div>
            </div>
        </header>

    )

}

export default Header;

