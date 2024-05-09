import '../styles/footer.css'
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'

const Footer = () => {
    return (
        <footer className="footer">
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
      </footer>
    )
}

export default Footer