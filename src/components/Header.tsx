import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';
import { useState } from 'react';
import UserLogo from '../assets/img/user-icon.png';

const Header = () => {

    const navigate = useNavigate();

    const [openLinks, setOpenLinks] = useState(false);

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };

    return (
        <div className='navbar'>
            <div className='leftSide' id={openLinks ? "open" : "close"}>
                <img id='logo-header' src={Logo} />
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
                <Link to="/" id='contact'>Contáctanos</Link>
                <button className='icono-responsive' onClick={toggleNavbar}><ReorderIcon/></button>
                <div className='cuenta'>
                    <button className='iniciar-sesion'>Iniciar sesión</button>
                    <label id='diagonal'>/</label>
                    <button className='registrate'>Regístrate</button>
                    <div className='mi-cuenta'>
                        <img src={UserLogo} alt="" style={{width: '50px', cursor: 'pointer', margin: '-17px'}}/>
                        <Link to="/" id='mi-cuenta'>Mi Cuenta</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;