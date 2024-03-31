
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';

const HeaderAnterior = () => {

    const navigate = useNavigate();

    return (
        <div className='navbar'>
            <div className='leftSide'>
                <img src={Logo} />
            </div>
            <div className='rightSide'>
                <Link to="/">Inicio</Link>
                <Link to="/">Menú</Link>
                <Link to="/">Sobre nosotros</Link>
                <Link to="/">Contáctanos</Link>
                <button><ReorderIcon/></button>
            </div>
        </div>
        
    )
}

export default HeaderAnterior;