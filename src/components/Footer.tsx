import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

const Footer = () => {
    return (
            <MDBFooter className='text-center text-lg-start text-muted'>
                <section className=''>
                    <MDBContainer className='text-center text-md-start mt-5' style={{color: 'white'}}>
                        <MDBRow className='mt-3'>
                            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4' >
                                <img src="./src/assets/img/HatchfulExport-All/logo_transparent_header.png" alt="Logo" style={{width: '248px', display: 'flex', marginTop: '3px' }}/>
                                <br />
                                <p>
                                    ¡Tu comida a la velocidad del rayo!
                                </p>
                            </MDBCol>

                            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                                <h6 className='text-uppercase fw-bold mb-4'>- Legal -</h6>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Términos y condiciones
                                    </a>
                                </p>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Privacidad
                                    </a>
                                </p>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Defensa del consumidor
                                    </a>
                                </p>
                            </MDBCol>

                            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                                <h6 className='text-uppercase fw-bold mb-4'>- Nosotros -</h6>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        ¿Quiénes somos?
                                    </a>
                                </p>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Mejores comidas
                                    </a>
                                </p>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Promociones
                                    </a>
                                </p>

                            </MDBCol>

                            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                                <h6 className='text-uppercase fw-bold mb-4'>- Contáctanos -</h6>
                                <p>
                                    <MDBIcon icon="home" className="me-2" />
                                    Mendoza, Argentina
                                </p>
                                <p>
                                    <MDBIcon icon="envelope" className="me-3" />
                                    contactodelbuensabor@gmail.com
                                </p>
                                <p>
                                    <MDBIcon icon="phone" className="me-3" /> + 261 255 3696
                                </p>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            </MDBFooter>
    )
}

export default Footer