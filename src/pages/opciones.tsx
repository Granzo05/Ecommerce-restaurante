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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

//import Logo from '../assets/img//HatchfulExport-All/logo_transparent.png'
import StocksEntrantes from '../components/StockEntrante/StockEntrante';
import Sucursales from '../components/Sucursales/Sucursales';
import Ingredientes from '../components/Ingrediente/Ingredientes';
import ArticuloVentas from '../components/ArticulosVenta/ArticulosVenta';

//const navItems = ["home", "settings", "build", "cloud", "mail", "bookmark"];

const Opciones = () => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(1);
    const [isVisible, setVisible] = useState<boolean>(true);
    const [pedidosVisible, setPedidosVisible] = useState(false);
    const [stockVisible, setStockVisible] = useState(false);
    const [pedidosIcon, setPedidosIcon] = useState(<KeyboardArrowRightIcon />);
    const [stockIcon, setStockIcon] = useState(<KeyboardArrowRightIcon />);

    const toggleStockVisibility = () => {
        setStockVisible(!stockVisible);
        setStockIcon(stockVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        if (!stockVisible && opcionSeleccionada >= 5 && opcionSeleccionada <= 6) {
            setOpcionSeleccionada(opcionSeleccionada); // Si está seleccionada una opción de Stock, mantenerla seleccionada
        }
    };

    const togglePedidosVisibility = () => {
        setPedidosVisible(!pedidosVisible);
        setPedidosIcon(pedidosVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        if (!pedidosVisible && opcionSeleccionada >= 1 && opcionSeleccionada <= 4) {
            setOpcionSeleccionada(opcionSeleccionada); // Si está seleccionada una opción de Pedidos, mantenerla seleccionada
        }
    };

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


    return (
        <div className="sidebar">
            <div className="opciones-menu">
                <div className="title">
                    <h3 className='title'><img src="../src/assets/img/HatchfulExport-All/logo-simple.png" alt="Logo" className='logo-opciones' />EL BUEN SABOR</h3>

                </div>
                <hr />
                <label id='label'>_inicio</label>
                {isVisible ? (
                    <div className="main-options">
                        <div className="pedidos">
                            <h4 onClick={togglePedidosVisibility} className={opcionSeleccionada >= 1 && opcionSeleccionada <= 4 ? 'h4-selected' : ''}>
                                Pedidos{pedidosIcon}
                            </h4>
                            {pedidosVisible && (
                                <>
                                    <p
                                        className={opcionSeleccionada === 1 ? 'selected' : ''}
                                        onClick={() => handleOpcionClick(1)}
                                    >
                                        Pedidos entrantes
                                    </p>
                                    <p
                                        className={opcionSeleccionada === 2 ? 'selected' : ''}
                                        onClick={() => handleOpcionClick(2)}
                                    >
                                        Pedidos aceptados
                                    </p>
                                    <p
                                        className={opcionSeleccionada === 3 ? 'selected' : ''}
                                        onClick={() => handleOpcionClick(3)}
                                    >
                                        Pedidos cocinados
                                    </p>
                                    <p
                                        className={opcionSeleccionada === 4 ? 'selected' : ''}
                                        onClick={() => handleOpcionClick(4)}
                                    >
                                        Pedidos entregados
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="stock">
                            <h4 onClick={toggleStockVisibility} className={opcionSeleccionada >= 5 && opcionSeleccionada <= 6 ? 'h4-selected' : ''}>Stock{stockIcon}</h4>
                            {stockVisible && (
                                <>
                                    <p
                                        className={opcionSeleccionada === 5 ? 'selected' : ''}
                                        onClick={() => handleOpcionClick(5)}
                                    >
                                        Stock
                                    </p>
                                    <p
                                        className={opcionSeleccionada === 6 ? 'selected' : ''}
                                        onClick={() => handleOpcionClick(6)}
                                    >
                                        Stock entrante
                                    </p>
                                </>
                            )}
                        </div>
                        <h4
                            className={opcionSeleccionada === 7 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(7)}
                        >
                            Menus
                        </h4>
                        <h4
                            className={opcionSeleccionada === 11 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(11)}
                        >
                            Articulos
                        </h4>
                        <h4
                            className={opcionSeleccionada === 8 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(8)}
                        >
                            Empleados
                        </h4>
                        <h4
                            className={opcionSeleccionada === 9 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(9)}
                        >
                            Sucursales
                        </h4>
                        <h4
                            className={opcionSeleccionada === 10 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(10)}
                        >
                            Ingredientes
                        </h4>
                    </div>
                ) : (
                    <div className="main-options">
                        <p
                            className={opcionSeleccionada === 2 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(2)}
                        >
                            Pedidos aceptados
                        </p>
                        <p
                            className={opcionSeleccionada === 5 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(5)}
                        >
                            Stock
                        </p>
                        <p
                            className={opcionSeleccionada === 6 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(6)}
                        >
                            Stock entrante
                        </p>
                        <p
                            className={opcionSeleccionada === 7 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(7)}
                        >
                            Menus
                        </p>
                        <p
                            className={opcionSeleccionada === 11 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(11)}
                        >
                            Articulos
                        </p>
                        <p
                            className={opcionSeleccionada === 10 ? 'selected' : ''}
                            onClick={() => handleOpcionClick(10)}
                        >
                            Ingredientes
                        </p>
                    </div>
                )}
                <label id='label'>_ajustes</label>
            </div>


            <div style={{ flex: 1 }}>
                {renderInformacion()}
            </div>
        </div>



    );
};

export default Opciones;
