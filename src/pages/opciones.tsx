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

import Logo from '../assets/img//HatchfulExport-All/logo_transparent.png'

//const navItems = ["home", "settings", "build", "cloud", "mail", "bookmark"];

const Opciones = () => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(1);
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
            return <Menus />;
        } else if (opcionSeleccionada === 7) {
            return <Empleados />;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isVisible = await EmpleadoService.checkUser();
                setVisible(isVisible)
                if (!isVisible) {
                    setOpcionSeleccionada(2);
                } else {
                    setOpcionSeleccionada(1);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);


    const [isOpen, setIsOpen] = useState(false);
    return (
        <body>
            <section className="page sidebar-2-page">
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
            </section>

        </body>


    );
};

export default Opciones;

/*<body>
            <div style={{ display: 'flex' }} className='opciones'>
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

            <div style={{ flex: 1 }}>
                {renderInformacion()}
            </div>
        </div >
        </body>*/
