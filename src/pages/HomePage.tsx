import { useEffect, useState } from 'react';
import '../styles/homePage-header-footer.css'
import { SucursalService } from '../services/SucursalService';
import { useParams } from 'react-router-dom';
import { Promocion } from '../types/Productos/Promocion';
import DetallesPromocion from '../components/Promociones/DetallesPromocion';
import { SucursalDTO } from '../types/Restaurante/SucursalDTO';
import HeaderHomePage from '../components/headerHomePage';
import Footer from '../components/Footer';
import ModalCrud from '../components/ModalCrud';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { formatearFechaDDMMYYYY } from '../utils/global_variables/functions';

export default function MainMenu() {
    const [scrolled, setScrolled] = useState(false);
    const { id } = useParams()

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (id)
            SucursalService.getSucursalDTOById(parseInt(id))
                .then(async sucursal => {
                    if (sucursal) {
                        setSucursal(sucursal);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
    }, [id]);


    const [sucursal, setSucursal] = useState<SucursalDTO>(new SucursalDTO());

    const [selectedPromocion, setSelectedPromocion] = useState<Promocion>(new Promocion());
    const [showDetallePromocionModal, setShowDetallePromocionModal] = useState<boolean>(false);

    function handleMenu(tipoComida: string) {
        // Que asigne el id de la sucursal por si necesitamos traer otros datos
        window.history.pushState({ path: `/${id}/menu/${tipoComida}` }, '', `/${id}/menu/${tipoComida}`);
    }

    const handleModalClose = () => {
        setShowDetallePromocionModal(false);
    };

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    useEffect(() => {
        if (sucursales.length === 0) fetchSucursales();
    }, [sucursales]);

    const fetchSucursales = async () => {
        SucursalService.getSucursales()
            .then(data => {
                setSucursales(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (sucursal?.nombre) {
            document.title = 'El Buen Sabor - ' + sucursal?.nombre;
        } else {
            document.title = 'El Buen Sabor';
        }
    }, [sucursal]);

    return (
        <>
            <HeaderHomePage scrolled={scrolled} />
            <section id='servicios' className='information container'>
                <div className="information-content">
                    <div className='information-1'>
                        <div className="information-c1">
                            <h3>&mdash; Historia &mdash;</h3>
                            <p>"El Buen Sabor", fundado en 2000 por Carlos Rodríguez, ofrece una experiencia culinaria auténtica y única en nuestro país. Desde entonces, nos dedicamos a brindar platos que reflejan nuestra tradición gastronómica.</p>
                        </div>
                        <div className="information-a1">
                            <img src="../src/assets/img/restaurante-bg.avif" alt="" />
                        </div>
                    </div>
                    <div className='information-2'>
                        <div className="information-b1">
                            <img src="../src/assets/img/meseros.jpg" alt="" />
                        </div>
                        <div className="information-c1">
                            <h3>&mdash; Sobre nosotros &mdash;</h3>
                            <p>"El Buen Sabor", un lugar de comidas dedicado a ofrecer lo mejor de la gastronomía local. Brindamos platos deliciosos con ingredientes frescos y de alta calidad, en un ambiente acogedor y familiar. Nos enorgullece presentar una selección de especialidades que resaltan los sabores auténticos de nuestra región, elaborados con pasión y cuidado por nuestros chefs expertos. En "El Buen Sabor", cada comida es una celebración de la tradición culinaria y un momento para disfrutar en compañía de seres queridos.</p>
                        </div>
                    </div>
                </div>
            </section>
            {sucursal && sucursal.promociones?.length > 0 && (
                <>
                    <section className='our'>
                        <div id='ofertas' className="container">
                            <h2 className='nuestras-promociones'>&mdash; Nuestras promociones &mdash;</h2>
                        </div>
                    </section>
                    <section className="oferts">
                        <div className="ofert-content container">
                            {sucursal && sucursal.promociones.map(promocion =>
                                <div key={promocion.id} className="ofert-1">
                                    <div className="ofert-txt">
                                        <h3>{promocion.nombre}</h3>
                                        <p>Desde: {formatearFechaDDMMYYYY(new Date(promocion.fechaDesde.toString()))}</p>
                                        <p>Hasta: {formatearFechaDDMMYYYY(new Date(promocion.fechaHasta.toString()))}</p>
                                        <a className='btn-2' onClick={() => { setShowDetallePromocionModal(true); setSelectedPromocion(promocion) }}>Más Información</a>
                                    </div>
                                    <div className="ofert-img">
                                        <img src={promocion.imagenes[0].ruta} alt="" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            <section className='bg'></section>
            <section id='menus' className='food container'>
                <ModalCrud isOpen={showDetallePromocionModal} onClose={handleModalClose}>
                    <DetallesPromocion selectedPromocion={selectedPromocion} onCloseModal={handleModalClose} />
                </ModalCrud>
                <h2>&mdash; Menús &mdash;</h2>
                <span>Categorías</span>
                <div className="food-content">
                    {sucursal && sucursal.categorias?.length > 0 && (
                        <>
                            <div className="left">
                                {sucursal && sucursal.categorias.map((categoria, index) => {
                                    if (index < sucursal.categorias.length / 2) {
                                        return (
                                            <div className="food-1" key={index}>
                                                <h3>{categoria.nombre.replace(/_/g, ' ')}</h3>
                                                <div className="food-txt">
                                                    <p>
                                                        {categoria.imagenes.length > 0 ? (
                                                            <img src={categoria.imagenes[0]?.ruta} alt="" className="menu-img" />
                                                        ) : (
                                                            <img src='../src/assets/img/default.jpg' alt="" className="menu-img" />
                                                        )}
                                                    </p>
                                                    <div className="overlay">
                                                        <p className='abrir-menu' onClick={() => handleMenu(categoria.nombre.toLowerCase())}>Ver menús</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>
                            <div className="right">
                                {sucursal && sucursal.categorias.map((categoria, index) => {
                                    if (index >= sucursal.categorias.length / 2) {
                                        return (
                                            <div className="food-1" key={index}>
                                                <h3>{categoria.nombre.replace(/_/g, ' ')}</h3>
                                                <div className="food-txt">
                                                    <p>
                                                        {categoria.imagenes.length > 0 ? (
                                                            <img src={categoria.imagenes[0]?.ruta} alt="" className="menu-img" />
                                                        ) : (
                                                            <img src='../src/assets/img/default.jpg' alt="" className="menu-img" />
                                                        )}
                                                    </p>                                                    <div className="overlay">
                                                        <p className='abrir-menu' onClick={() => handleMenu(categoria.nombre.toLowerCase())}>Ver menús</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>

                        </>
                    )}
                </div>
            </section>
            <Footer sucursal={sucursal}></Footer>
        </>
    )
}