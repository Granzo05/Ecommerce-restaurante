import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import '../styles/footer.css'

const Footer = () => {
    return (
        <footer className="footer">
        <div className="footer-container">
          <div className="footer-newsletter">
            <h1 className="footer-newsletter__header">
              Want us to email you with the latest blockbuster news?
            </h1>
            <div className="footer-newsletter__form">
              <input type="email" name="email" placeholder="example@xyz.com"/>
              <button type="submit" className="submit-btn">Subscribe</button>
            </div>
          </div>
          <div className="footer-body">
            <div className="footer-body__content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis
                esse illo culpa aperiam minima odit? Nihil quod illo pariatur
                libero.
              </p>
            </div>
            <nav className="footer-body__nav">
              <ul className="footer-body__nav-list">
                <li className="footer-body__nav-item">
                  Services
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
                  About
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
                  Support
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
              <p>&copy; Company 2024. All right reserved.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer