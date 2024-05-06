import { Link } from 'react-router-dom';
import '../styles/header.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import ReorderIcon from '@mui/icons-material/Reorder';
import { useEffect, useState } from 'react';
import UserLogo from '../assets/img/user-icon.png';
import CarritoComponent from './CarritoComponent';

const Header = () => {
   

    return (
        <header>
            <img id='logo-header' src={Logo} />
        </header>

    )

}

export default Header;

