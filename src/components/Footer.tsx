import '../styles/footer.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png';
import React, { useState } from 'react';

const Footer = () => { 
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Datos de ejemplo para una sucursal seleccionada
  const branchData = {
    location: "Calle Falsa 123, Springfield",
    schedule: {
      weekdays: "Lunes a sábado: 9am - 11pm",
      sunday: "Domingo: 11am - 9pm"
    }
  };

  return (
    <footer id='contactos' className='footer'>
      <div className="footer-content container">
        <div className="link">
          <ul>
            <li>
              <h3 style={{fontSize:'19px', color: '#FFFFFF'}}>&mdash; Contacto &mdash;</h3>
              <ul>
                <li><a href="https://instagram.com" style={{textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://twitter.com" style={{textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://whatsapp.com" style={{textDecoration: 'underline'}}>WhatsApp</a></li>
              </ul>
            </li>
            <li>
              <h3 style={{fontSize:'19px', color: '#FFFFFF'}}>&mdash; Ubicación &mdash;</h3>
              <ul>
                {selectedBranch ? (
                  <>
                    <li><a>{branchData.location}</a></li>
                    <li><a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a></li>
                    <li><a href="https://www.yelp.com" target="_blank" rel="noopener noreferrer">Yelp</a></li>
                  </>
                ) : (
                  <>
                    <li><a>NO HA SELECCIONADO UNA SUCURSAL. </a><a href="/selec-sucursal" style={{textDecoration: 'underline'}}>HÁGALO AHORA</a></li>
                 </>
                )}
              </ul>
            </li>
            <li>
              <h3 style={{fontSize:'19px', color: '#FFFFFF'}}>&mdash; Horario &mdash;</h3>
              <ul>
                {selectedBranch ? (
                  <>
                    <li><a>{branchData.schedule.weekdays}</a></li>
                    <li><a>{branchData.schedule.sunday}</a></li>
                  </>
                ) : (
                  <>
                    <li><a>NO HA SELECCIONADO UNA SUCURSAL. </a><a href="/selec-sucursal" style={{textDecoration: 'underline'}}>HÁGALO AHORA</a></li>
                   
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



/*<footer className="footer">
        <div className="footer-container">
          
          <div className="footer-body">
            <div className="footer-body__content">
              
              <p style={{color: 'white'}}>
                <img id='logo-footer' src={Logo} />
                Donde la magia de las estrellas llega a tu puerta con cada entrega. Descubre nuestros sabores y déjate llevar por la excelencia culinaria. ¡Sabor, calidad y comodidad, todo en un solo lugar!
              </p>
            </div>
            <nav className="footer-body__nav">
              <ul className="footer-body__nav-list">
                <li className="footer-body__nav-item">
                  Servicios
                  <ul className="footer-body__nav-sublist">
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">Marketing</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">Design</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">App Development</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">Web development</a>
                    </li>
                  </ul>
                </li>
                <li className="footer-body__nav-item">
                  Sobre nosotros
                  <ul className="footer-body__nav-sublist">
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">About</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">Careers</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">History</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">Our Team</a>
                    </li>
                  </ul>
                </li>
                <li className="footer-body__nav-item">
                  Soporte
                  <ul className="footer-body__nav-sublist">
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">FAQs</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">Contact</a>
                    </li>
                    <li className="footer-body__nav-subitem">
                      <a href="" className="footer-body__nav-link">Live chat</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
          <div className="footer-attribute">
              <p>&copy; Copyright 2024. All right reserved.</p>
          </div>
        </div>
      </footer> */