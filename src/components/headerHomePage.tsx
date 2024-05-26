import React, { useEffect, useState } from 'react';

const HeaderHomePage: React.FC = () => {

       
    return (
        <header id='inicio' className="header">
            <div id='header-oscuro' className="menu container">
                <a href="" className="logo"><img src="../src/assets/img/HatchfulExport-All/logo_transparent_header.png" alt="" /></a>
                <input type="checkbox" id="menu" />
                <label htmlFor="menu">
                    <img src="../src/assets/icons/header-icono-responsive.png" className="menu-icono" alt="menu" />
                </label>
                <nav className="navbar">
                    <ul>
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#servicios">Nosotros</a></li>
                        <li><a href="#ofertas">Promociones</a></li>
                        <li><a href="#menus">Menús</a></li>
                        <li><a href="#contactos">Contactos</a></li>
                    </ul>
                    <ul>
                        <li className='btn-iniciar-sesion'><a href="/login-cliente">Iniciar sesión</a></li>
                    </ul>
                </nav>
            </div>
            <div className="header-content container">
                <div className="header-txt">
                    <h1>El Buen Sabor</h1>
                    <p>¡Donde lo buenardo es rutina!</p>
                </div>
            </div>
        </header>
    );
}

export default HeaderHomePage;

