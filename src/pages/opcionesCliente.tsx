import { useEffect, useState } from 'react';
import '../styles/opcionesCliente.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PedidosPendientes from '../components/Cliente/PedidosPendientes';
import PedidosRealizados from '../components/Cliente/PedidosRealizados';
import Cuenta from '../components/Cliente/Cuenta';
import Perfil from '../components/Cliente/Perfil';
import { Cliente } from '../types/Cliente/Cliente';
import { useLocation, useParams } from 'react-router-dom';
import { getBaseUrl } from '../utils/global_variables/const';

const OpcionesCliente = () => {
    const { opcionElegida } = useParams();
    const [opcionSeleccionada, setOpcionSeleccionada] = useState<number>(0);
    const location = useLocation();
    const [isVisible, setVisible] = useState<boolean>(true);
    const [pedidosVisible, setPedidosVisible] = useState(false);
    const [pedidosIcon, setPedidosIcon] = useState(<KeyboardArrowRightIcon />);
    const [menuVisible, setMenuVisible] = useState(true);
    const [opcionesBg] = useState('');
    const [sidebarBg, setSidebarBg] = useState('');

    const [cliente, setCliente] = useState<Cliente | null>(null);

    useEffect(() => {
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);
    }

    useEffect(() => {
        if (opcionElegida === undefined) {
            setOpcionSeleccionada(0);
        } else {
            handleOpcionClick(parseInt(opcionElegida));
        }
    }, [opcionElegida]);


    const togglePedidosVisibility = () => {
        setPedidosVisible(!pedidosVisible);
        setPedidosIcon(pedidosVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        if (!pedidosVisible && opcionSeleccionada >= 1 && opcionSeleccionada <= 4) {
            setOpcionSeleccionada(opcionSeleccionada);
        }

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
        document.title = 'Administración y opciones';
    }, []);

    return (
        <>
            <div className={`sidebar ${sidebarBg}`}>
                <div className={`opciones-menu`}>
                    <div className="title-header">
                        <p onClick={() => window.location.href = getBaseUrl()} className='volver-menu'>⭠ Volver</p>
                        <img src="../src/assets/img/HatchfulExport-All/logo_transparent_header.png" alt="Logo" title='VOLVER AL MENU PRINCIPAL' className="logo-opciones" onClick={() => window.location.href = getBaseUrl()} />
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
                                <label className="name-account">{cliente?.nombre}</label>
                            </div>
                            <LogoutIcon onClick={() => window.location.href = 'http://localhost:5173/login-negocio'} className="logout-icon" style={{ fontSize: '38px', display: 'inline' }} />
                        </div>
                    </div>
                </div>

                <div className={`table-info ${menuVisible ? '' : 'expanded'}`} style={{ flex: 1, backgroundColor: 'white' }}>
                    {renderInformacion()}
                </div>
            </div>
        </>

    );
};

export default OpcionesCliente;
