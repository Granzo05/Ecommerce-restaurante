import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    return (
        <header>
            <Navbar expand="lg" className="bg-body-tertiary" style={{ height: '100px', width: '100%' }}>
                <Container fluid style={{backgroundColor: 'black'}}>
                    <Navbar.Brand href="/" style={{backgroundColor: 'black'}}>
                        <img src="./src/assets/img/HatchfulExport-All/logo_transparent_header.png" alt="Logo" style={{width: '176px', display: 'flex', marginTop: '25px' }}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px', width: '100%', display: 'flex', justifyContent: 'space-around', height: '26px', fontSize: '25px' }}
                            navbarScroll
                        >
                            <Nav.Link style={{color: 'white', fontFamily: 'fantasy'}} onClick={() => navigate('/')}>Inicio</Nav.Link>
                            <Nav.Link style={{color: 'white', fontFamily: 'fantasy'}} onClick={() => navigate('/')}>Link</Nav.Link>
                            <NavDropdown title="Link" id="navbarScrollingDropdown" style={{color: 'white'}} >
                                <NavDropdown.Item onClick={() => navigate('/pago')}>Pago</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate('/acceso-denegado')}>Acceso denegado</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => navigate('/login-cliente')}>Login cliente
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav style={{display: 'flex', marginTop: '24px'}}>
                            <Nav.Link 
                                style={{color: 'white', fontFamily: 'fantasy', textDecoration: 'none', whiteSpace: 'nowrap'}} 
                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} 
                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                onClick={() => navigate('/login')}
                            >
                                Iniciar sesión
                            </Nav.Link>
                            <label htmlFor="" style={{color: 'white', display: 'flex', marginTop: '10px'}}>/</label>
                            <Nav.Link 
                                style={{color: 'white', fontFamily: 'fantasy', textDecoration: 'none'}} 
                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} 
                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                onClick={() => navigate('/registro')}
                            >
                                Registrarse
                            </Nav.Link>
                            <Nav.Link 
                                style={{color: 'white', fontFamily: 'fantasy', textDecoration: 'none', whiteSpace: 'nowrap', display: 'none'}}
                                onClick={() => navigate('/mi-cuenta')}
                            >
                                <img src="./src/assets/img/user-icon.png" alt="User Icon" style={{ width: '35px', marginRight: '5px' }} /> Mi Cuenta
                            </Nav.Link>
                        </Nav>
                        {/* <Form className="d-flex" style={{display: 'flex', marginTop: '26px'}}>
                            <Form.Control
                                type="search"
                                placeholder="Buscar"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button style={{width: '50px', backgroundColor: 'green'}} variant="outline-success"><img src="./src/assets/img/search.png" alt="logo-search" style={{width: '25px'}}/></Button>
                        </Form> */}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;