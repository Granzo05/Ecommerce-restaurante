import React, { useEffect, useState } from 'react';
import PedidosEntrantes from '../components/Pedidos/PedidosEntrantesRestaurante';
import PedidosEntregados from '../components/Pedidos/PedidosEntregadosRestaurante';
import Preferencias from '../components/Preferencias';
import '../styles/opcionesCliente.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { EmpleadoService } from '../services/EmpleadoService';
import PedidosPendientes from '../components/Cliente/PedidosPendientes';
import PedidosRealizados from '../components/Cliente/PedidosRealizados';
import Cuenta from '../components/Cliente/Cuenta';
import Perfil from '../components/Cliente/Perfil';
import Header from '../components/Header';

const OpcionesCliente = () => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState<number>(0);
    const [isVisible, setVisible] = useState<boolean>(true);
    const [pedidosVisible, setPedidosVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [pedidosIcon, setPedidosIcon] = useState(<KeyboardArrowRightIcon />);
    const [settingsIcon, setSettingsIcon] = useState(<KeyboardArrowRightIcon />);
    const [sidebarIcon, setSidebarIcon] = useState(<ArrowForwardIosIcon />);
    const [topIcon, setTopIcon] = useState(<KeyboardArrowDownIcon />);
    const [menuVisible, setMenuVisible] = useState(true);
    const [opcionesBg, setOpcionesBg] = useState('');
    const [settingsBg, setSettingsBg] = useState('');
    const [sidebarBg, setSidebarBg] = useState('');

    const togglePedidosVisibility = () => {
        setPedidosVisible(!pedidosVisible);
        setPedidosIcon(pedidosVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        if (!pedidosVisible && opcionSeleccionada >= 1 && opcionSeleccionada <= 4) {
            setOpcionSeleccionada(opcionSeleccionada);
        }
    };

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
        setSidebarIcon(menuVisible ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />);
        setTopIcon(menuVisible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />);
    };

    const handleOpcionClick = (opcion: number) => {
        setOpcionSeleccionada(opcion);
        setSidebarBg('white');
    };

    const renderInformacion = () => {
        switch (opcionSeleccionada) {
            case 1:
                return <PedidosPendientes />;
            case 2:
                return <PedidosRealizados />;
            case 3:
                    return <Perfil />;
            case 4:
                return <Cuenta />;
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

    useEffect(() => {
        document.title = 'Administración y opciones';
    }, []);

    return (
        <>
        <div className={`sidebar ${sidebarBg}`}>
            <div className={`opciones-menu ${menuVisible ? 'hidden' : 'visible'}`}>
                <div className="title-header">
                    <img src="../src/assets/img/HatchfulExport-All/logo_transparent_header.png" alt="Logo" title='VOLVER AL MENU PRINCIPAL' className="logo-opciones" onClick={() => window.location.href = 'http://localhost:5173/'}/>
                    <div className="icon-sidebar" onClick={toggleMenuVisibility}>
                        {sidebarIcon}
                    </div>
                </div>
                <hr />
                <label id="label" className={`opciones-link ${opcionesBg}`} onClick={() => setOpcionSeleccionada(0)}>
                    _opciones
                </label>

                {isVisible && (
                    <div className="main-options">
                        <div className="pedidos">
                            <h4 onClick={togglePedidosVisibility} className={opcionSeleccionada >= 1 && opcionSeleccionada <= 2 ? 'h4-selected' : ''}>
                                Pedidos
                                {pedidosIcon}
                            </h4>
                            {pedidosVisible && (
                                <>
                                    <p className={opcionSeleccionada === 1 ? 'selected' : ''} onClick={() => handleOpcionClick(1)}>
                                        Pedidos pendientes
                                    </p>
                                    <p className={opcionSeleccionada === 2 ? 'selected' : ''} onClick={() => handleOpcionClick(2)}>
                                        Pedidos realizados
                                    </p>
                                </>
                            )}
                        </div>
                        <h4 className={opcionSeleccionada === 3 ? 'selected' : ''} onClick={() => handleOpcionClick(3)}>
                            Perfil
                        </h4>
                        <h4 className={opcionSeleccionada === 4 ? 'selected' : ''} onClick={() => handleOpcionClick(4)}>
                            Cuenta
                        </h4>
                    </div>
                )}

                <div className="spacer"></div>
                <div className="bottom-section">
                    <hr />
                    <div className="perfil-employee">
                        <PersonIcon style={{ fontSize: '38px', display: 'inline' }} />
                        <div className="account-info">
                            <label className="name-account">Augusto David Ficara Vargas</label>
                        </div>
                        <LogoutIcon onClick={() => window.location.href = 'http://localhost:5173/login-negocio'} className="logout-icon" style={{ fontSize: '38px', display: 'inline' }} />
                    </div>
                    <div className="icon-topbar" onClick={toggleMenuVisibility}>
                        {topIcon}
                    </div>
                </div>
            </div>

            <div className={`table-info ${menuVisible ? '' : 'expanded'}`} style={{ flex: 1 }}>
                {renderInformacion()}
            </div>
        </div>
        </>
        
    );
};

export default OpcionesCliente;
