import { useEffect, useState } from 'react';
import { SucursalService } from '../services/SucursalService';
import { useParams } from 'react-router-dom';
import { Promocion } from '../types/Productos/Promocion';
import ModalFlotante from '../components/ModalFlotante';
import DetallesPromocion from '../components/Promociones/DetallesPromocion';
import { SucursalDTO } from '../types/Restaurante/SucursalDTO';
import HeaderHomePage from '../components/headerHomePage';
import Footer from '../components/Footer';



export default function MainMenu() {
    const convertirFecha = (date: Date) => {
        const dia = date.getDate() + 1;
        const mes = date.getMonth() + 1;
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };
    const { id } = useParams()

    const [sucursal, setSucursal] = useState<SucursalDTO>();

    const [selectedPromocion, setSelectedPromocion] = useState<Promocion>(new Promocion());
    const [showDetallePromocionModal, setShowDetallePromocionModal] = useState<boolean>(false);

    function handleMenu(tipoComida: string) {
        window.location.href = 'menu/' + tipoComida;
    }


    const handleModalClose = () => {
        setShowDetallePromocionModal(false);
    };

    useEffect(() => {
        SucursalService.getSucursalDTOById(1)
            .then(async sucursal => {
                console.log(sucursal)
                if (sucursal) setSucursal(sucursal);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }, [id]);

    useEffect(() => {
        if (sucursal?.nombre) {
            document.title = sucursal?.nombre;
        } else {
            document.title = 'El Buen Sabor';
        }
    }, [sucursal]);

    return (
        <>
            <HeaderHomePage></HeaderHomePage>
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
                            <p>Somos "El Buen Sabor", un lugar de comidas dedicado a ofrecer lo mejor de la gastronomía local. Nuestro compromiso es brindar platos deliciosos con ingredientes frescos y de alta calidad, en un ambiente acogedor y familiar. Nos enorgullece presentar una selección de especialidades que resaltan los sabores auténticos de nuestra región, elaborados con pasión y cuidado por nuestros chefs expertos. En "El Buen Sabor", cada comida es una celebración de la tradición culinaria y un momento para disfrutar en compañía de seres queridos.</p>
                        </div>
                    </div>
                </div>
            </section>
            {sucursal && sucursal.promociones?.length > 0 && (
                <>
                    <section className='our'>
                        <div id='ofertas' className="container">
                            <h3>&mdash; Nuestras promociones &mdash;</h3>
                        </div>
                    </section>
                    <section className="oferts">
                        <div className="ofert-content container">
                            {sucursal && sucursal.promociones.map(promocion =>
                                <div key={promocion.id} className="ofert-1">
                                    <div className="ofert-txt">
                                        <h3>{promocion.nombre}</h3>
                                        <p>Desde: {convertirFecha(new Date(promocion.fechaDesde))}</p>
                                        <p>Hasta: {convertirFecha(new Date(promocion.fechaHasta))}</p>
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
                <ModalFlotante isOpen={showDetallePromocionModal} onClose={handleModalClose}>
                    <DetallesPromocion selectedPromocion={selectedPromocion} />
                </ModalFlotante>
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
            <Footer></Footer>
        </>
    )
}