import { useEffect, useState } from 'react';
import PedidosEntrantes from '../components/Pedidos/PedidosEntrantesRestaurante';
import PedidosAceptados from '../components/Pedidos/PedidosAceptadosRestaurante';
import PedidosEntregados from '../components/Pedidos/PedidosEntregadosRestaurante';
import PedidosCocinados from '../components/Pedidos/PedidosCocinadosRestaurante';
import Stock from '../components/Stock/Stock';
import Empleados from '../components/Empleados/Empleados';
import Menus from '../components/Menus/Menus';
import { EmpleadoService } from '../services/EmpleadoService';
import '../styles/opcionesRestaurante.css'

//import Logo from '../assets/img//HatchfulExport-All/logo_transparent.png'
import StocksEntrantes from '../components/StockEntrante/StockEntrante';
import Sucursales from '../components/Sucursales/Sucursales';
import Ingredientes from '../components/Ingrediente/Ingredientes';
import ArticuloVentas from '../components/ArticulosVenta/ArticulosVenta';

//const navItems = ["home", "settings", "build", "cloud", "mail", "bookmark"];

const Opciones = () => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState<number>(0);
    const [isVisible, setVisible] = useState<boolean>(true);

    const handleOpcionClick = (opcion: number) => {
        setOpcionSeleccionada(opcion);
    };

    const renderInformacion = () => {

        if (opcionSeleccionada === 1) {
            return <PedidosEntrantes />;
        } else if (opcionSeleccionada === 2) {
            return <PedidosAceptados />;
        } else if (opcionSeleccionada === 3) {
            return <PedidosCocinados />;
        } else if (opcionSeleccionada === 4) {
            return <PedidosEntregados />;
        } else if (opcionSeleccionada === 5) {
            return <Stock />;
        } else if (opcionSeleccionada === 6) {
            return <StocksEntrantes />;
        } else if (opcionSeleccionada === 7) {
            return <Menus />;
        } else if (opcionSeleccionada === 8) {
            return <Empleados />;
        } else if (opcionSeleccionada === 9) {
            return <Sucursales />;
        } else if (opcionSeleccionada === 10) {
            return <Ingredientes />;
        } else if (opcionSeleccionada === 11) {
            return <ArticuloVentas />;
        } else if (opcionSeleccionada === 0) {
            return <div className="opciones-pantallas">
                <h1>Inicio</h1>
            </div >
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setVisible(await EmpleadoService.checkUser());
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex' }} className='opciones'>
            {isVisible ? (
                <div className='opciones-menu'>
                    <p onClick={() => handleOpcionClick(1)}>Pedidos entrantes</p>
                    <p onClick={() => handleOpcionClick(2)}>Pedidos aceptados</p>
                    <p onClick={() => handleOpcionClick(3)}>Pedidos cocinados</p>
                    <p onClick={() => handleOpcionClick(4)}>Pedidos entregados</p>
                    <p onClick={() => handleOpcionClick(5)}>Stock</p>
                    <p onClick={() => handleOpcionClick(6)}>Stock entrante</p>
                    <p onClick={() => handleOpcionClick(7)}>Menus</p>
                    <p onClick={() => handleOpcionClick(11)}>Articulos</p>
                    <p onClick={() => handleOpcionClick(8)}>Empleados</p>
                    <p onClick={() => handleOpcionClick(9)}>Sucursales</p>
                    <p onClick={() => handleOpcionClick(10)}>Ingredientes</p>
                </div >
            ) : (
                <div className='opciones-menu'>
                    <p onClick={() => handleOpcionClick(2)}>Pedidos aceptados</p>
                    <p onClick={() => handleOpcionClick(5)}>Stock</p>
                    <p onClick={() => handleOpcionClick(6)}>Stock entrante</p>
                    <p onClick={() => handleOpcionClick(7)}>Menus</p>
                    <p onClick={() => handleOpcionClick(11)}>Articulos</p>
                    <p onClick={() => handleOpcionClick(10)}>Ingredientes</p>
                </div >
            )}

            <div style={{ flex: 1 }}>
                {renderInformacion()}
            </div>
        </div >


    );
};

export default Opciones;

/*<section className="page sidebar-2-page">
            <aside className={`sidebar-2 ${isOpen ? "open" : ""}`}>
                <div className="inner">
                    <header>
                        <button
                            type="button"
                            className="sidebar-2-burger"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className="material-symbols-outlined">
                                {isOpen ? "close" : "menu"}
                            </span>
                        </button>
                        <img style={{ width: '60%', height: '160px' }} src={Logo} />
                    </header>
                    <nav>
                        {isVisible ? (
                            <div className='opciones-menu'>
                                <p onClick={() => handleOpcionClick(1)}>Pedidos entrantes</p>
                                <p onClick={() => handleOpcionClick(2)}>Pedidos aceptados</p>
                                <p onClick={() => handleOpcionClick(3)}>Pedidos cocinados</p>
                                <p onClick={() => handleOpcionClick(4)}>Pedidos entregados</p>
                                <p onClick={() => handleOpcionClick(5)}>Stock</p>
                                <p onClick={() => handleOpcionClick(6)}>Menus</p>
                                <p onClick={() => handleOpcionClick(7)}>Empleados</p>
                            </div >
                        ) : (
                            <div className='opciones-menu'>
                                <p onClick={() => handleOpcionClick(2)}>Pedidos aceptados</p>
                                <p onClick={() => handleOpcionClick(5)}>Stock</p>
                                <p onClick={() => handleOpcionClick(6)}>Menus</p>
                            </div >
                        )}
                    </nav>
                </div>
            </aside>
            <div className='styled-table' style={{ flex: 1 }}>
                {renderInformacion()}
            </div>
        </section>*/
