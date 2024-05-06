import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import '../styles/headerLogin.css'
import React, { useEffect, useState } from 'react';

const HeaderLogin = () => {
    

    return (
        <header id='header-login'>
            <img id='logo-header-login' src={Logo}/>
        </header>
    )

}

export default HeaderLogin;

