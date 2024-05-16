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
    };

    const togglePedidosVisibility = () => {
        setPedidosVisible(!pedidosVisible);
        setPedidosIcon(pedidosVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
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
            <div className="opciones">
                {isVisible ? (
                    <div className="opciones-menu">
                        <div className="pedidos">
                            <h4 onClick={togglePedidosVisibility}>Pedidos{pedidosIcon}</h4>
                            {pedidosVisible && (
                                <>
                                    <p onClick={() => handleOpcionClick(1)}>Pedidos entrantes</p>
                                    <p onClick={() => handleOpcionClick(2)}>Pedidos aceptados</p>
                                    <p onClick={() => handleOpcionClick(3)}>Pedidos cocinados</p>
                                    <p onClick={() => handleOpcionClick(4)}>Pedidos entregados</p>
                                </>
                            )}
                        </div>
                        <div className="stock">
                            <h4 onClick={toggleStockVisibility}>Stock{stockIcon}</h4>
                            {stockVisible && (
                                <>
                                    <p onClick={() => handleOpcionClick(5)}>Stock</p>
                                    <p onClick={() => handleOpcionClick(6)}>Stock entrante</p>
                                </>
                            )}
                        </div>
                        <h4 onClick={() => handleOpcionClick(7)}>Menus</h4>
                        <h4 onClick={() => handleOpcionClick(11)}>Articulos</h4>
                        <h4 onClick={() => handleOpcionClick(8)}>Empleados</h4>
                        <h4 onClick={() => handleOpcionClick(9)}>Sucursales</h4>
                        <h4 onClick={() => handleOpcionClick(10)}>Ingredientes</h4>
                    </div>
                ) : (
                    <div className="opciones-menu">
                        <p onClick={() => handleOpcionClick(2)}>Pedidos aceptados</p>
                        <p onClick={() => handleOpcionClick(5)}>Stock</p>
                        <p onClick={() => handleOpcionClick(6)}>Stock entrante</p>
                        <p onClick={() => handleOpcionClick(7)}>Menus</p>
                        <p onClick={() => handleOpcionClick(11)}>Articulos</p>
                        <p onClick={() => handleOpcionClick(10)}>Ingredientes</p>
                    </div>
                )}

                <div style={{ flex: 1 }}>
                    {renderInformacion()}
                </div>
            </div>
        </div>
    );
};

export default Opciones;
