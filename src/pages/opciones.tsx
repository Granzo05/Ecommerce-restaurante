import { lazy, useEffect, useState } from 'react';

import Stock from '../components/Stock/Stock';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Empleado } from '../types/Restaurante/Empleado';
import { useParams } from 'react-router-dom';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { DESACTIVAR_PRIVILEGIOS, getBaseUrl, limpiarCredenciales } from '../utils/global_variables/const';
import { Empresa } from '../types/Restaurante/Empresa';
import ModalFlotante from '../components/ModalFlotante';
import PedidosEnCamino from '../components/Pedidos/PedidosEnCamino';
import { Roles } from '../types/Restaurante/Roles';
import RolesEmpleado from '../components/Roles/Roles';
import PrivilegiosEmpleados from '../components/Privilegios/Privilegios';

const StocksEntrantes = lazy(() => import('../components/StockEntrante/StockEntrante'));
const Sucursales = lazy(() => import('../components/Sucursales/Sucursales'));
const Ingredientes = lazy(() => import('../components/Ingrediente/Ingredientes'));
const ArticuloVentas = lazy(() => import('../components/ArticulosVenta/ArticulosVenta'));
const Categorias = lazy(() => import('../components/Categorias/Categorias'));
const Subcategorias = lazy(() => import('../components/Subcategorias/Subcategorias'));
const Medidas = lazy(() => import('../components/Medidas/Medidas'));
const Preferencias = lazy(() => import('../components/Preferencias'));
const Promociones = lazy(() => import('../components/Promociones/Promociones'));
const Empresas = lazy(() => import('../components/Empresas/Empresas'));
const Reportes = lazy(() => import('../components/Reportes/Reportes'));
const PedidosEntrantes = lazy(() => import('../components/Pedidos/PedidosEntrantesRestaurante'));
const PedidosAceptados = lazy(() => import('../components/Pedidos/PedidosAceptadosRestaurante'));
const PedidosEntregados = lazy(() => import('../components/Pedidos/PedidosEntregadosRestaurante'));
const PedidosParaEntregar = lazy(() => import('../components/Pedidos/PedidosParaEntregarRestaurante'));
const Empleados = lazy(() => import('../components/Empleados/Empleados'));
const Menus = lazy(() => import('../components/Menus/Menus'));

const Opciones = () => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState<number>(0);
    const [isVisible, setVisible] = useState<boolean>(true);
    const [pedidosVisible, setPedidosVisible] = useState(false);
    const [stockVisible, setStockVisible] = useState(false);
    const [reportesVisible, setReportesVisible] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [categoriaVisible, setCategoriaVisible] = useState(false);
    const [pedidosIcon, setPedidosIcon] = useState(<KeyboardArrowRightIcon />);
    const [stockIcon, setStockIcon] = useState(<KeyboardArrowRightIcon />);
    const [optionsIcon, setOptionsIcon] = useState(<KeyboardArrowRightIcon />);
    const [settingsIcon, setSettingsIcon] = useState(<KeyboardArrowRightIcon />);
    const [categoriaIcon, setCategoriaIcon] = useState(<KeyboardArrowRightIcon />);
    const [menuVisible] = useState(true);
    const [opcionesBg, setOpcionesBg] = useState('');
    const [settingsBg, setSettingsBg] = useState('');
    const { id } = useParams();

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');

        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const [empresa] = useState<Empresa | null>(() => {
        const empresaString = localStorage.getItem('empresa');

        return empresaString ? (JSON.parse(empresaString) as Empresa) : null;
    });

    if (((sucursal && id) && (sucursal.id > 0 && parseInt(id) > 0) && sucursal.id !== parseInt(id) || ((id && empleado) && parseInt(id) !== empleado.sucursales[0].id))) {
        window.location.href = getBaseUrl() + '/opciones';
    }

    const toggleStockVisibility = () => {
        setStockVisible(!stockVisible);
        setStockIcon(stockVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        if (!stockVisible && opcionSeleccionada >= 5 && opcionSeleccionada <= 6) {
            setOpcionSeleccionada(opcionSeleccionada);
        }
    };

    const toggleReportesVisibility = () => {
        setReportesVisible(!reportesVisible);
        setStockIcon(reportesVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        if (!reportesVisible && opcionSeleccionada >= 18 && opcionSeleccionada <= 18) {
            setOpcionSeleccionada(opcionSeleccionada);
        }
    };

    const toggleOptionsVisibility = () => {
        setOptionsVisible(!optionsVisible);
        setOptionsIcon(optionsVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        setOpcionesBg(optionsVisible ? '' : 'options-selected');
    };

    const toggleCategoriaVisibility = () => {
        setCategoriaVisible(!categoriaVisible);
        setCategoriaIcon(categoriaVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
    };

    const toggleSettingsVisibility = () => {
        setSettingsVisible(!settingsVisible);
        setSettingsIcon(settingsVisible ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />);
        setSettingsBg(settingsVisible ? '' : 'options-selected');
    };

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
        if (opcionSeleccionada === 1) {
            return <PedidosEntrantes />;
        } else if (opcionSeleccionada === 2) {
            return <PedidosAceptados />;
        } else if (opcionSeleccionada === 3) {
            return <PedidosParaEntregar />;
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
            return (
                <div className="welcome-employee">
                    <br /><br /><br /><br /><br /><br /><br /><br />
                    {empresa && empresa?.nombre?.length > 0 ? (
                        <h1 id="welcome">¡BIENVENIDO {empresa?.nombre}!</h1>
                    ) : (
                        <h1 id="welcome">¡BIENVENIDO {empleado?.nombre}{sucursal?.nombre}!</h1>
                    )}
                </div>
            );
        } else if (opcionSeleccionada === 12) {
            return <Categorias />;
        } else if (opcionSeleccionada === 13) {
            return <Subcategorias />;
        } else if (opcionSeleccionada === 14) {
            return <Medidas />;
        } else if (opcionSeleccionada === 15) {
            return <Preferencias />;
        } else if (opcionSeleccionada === 16) {
            return <Promociones />;
        } else if (opcionSeleccionada === 17) {
            return <Empresas />;
        } else if (opcionSeleccionada === 18) {
            return <Reportes />;
        } else if (opcionSeleccionada === 19) {
            return <PedidosEnCamino />;
        } else if (opcionSeleccionada === 20) {
            return <RolesEmpleado />;
        }else if (opcionSeleccionada === 21) {
            return <PrivilegiosEmpleados />;
        }
    };

    const [articuloVentaVisibleEmpleado, setArticuloVentaVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [articuloMenuVisibleEmpleado, setArticuloMenuVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [stockVisibleEmpleado, setStockVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [stockEntranteVisibleEmpleado, setStockEntranteVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [ingredientesVisibleEmpleado, setIngredientesVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [categoriasVisibleEmpleado, setCategoriasVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [medidasVisibleEmpleado, setMedidasVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [promocionesVisibleEmpleado, setPromocionesVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [subcategoriasVisibleEmpleado, setSubcategoriasVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [estadisticasVisibleEmpleado, setEstadisticasVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [empleadosVisibleEmpleado, setEmpleadosVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [sucursalesVisibleEmpleado, setSucursalesVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [empresasVisibleEmpleado, setEmpresasVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [pedidosEntrantesVisibleEmpleado, setPedidosEntrantesVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [pedidosAceptadosVisibleEmpleado, setPedidosAceptadosVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [pedidosCocinadosVisibleEmpleado, setPedidosCocinadosVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [pedidosEntregadosVisibleEmpleado, setPedidosEntregadosVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [pedidosEnCaminoVisibleEmpleado, setPedidosEnCaminoVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [rolesVisibleEmpleado, setRolesVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);
    const [privilegiosVisibleEmpleado, setPrivilegiosVisibleEmpleado] = useState(DESACTIVAR_PRIVILEGIOS);

    useEffect(() => {
        checkPrivilegies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function checkPrivilegies() {
        if (!DESACTIVAR_PRIVILEGIOS && (empleado !== null && empleado.privilegios?.length > 0)) {
            try {
                empleado?.privilegios?.forEach(privilegio => {
                    if (privilegio.nombre === 'Articulos de venta' && privilegio.permisos.includes('READ')) {
                        setArticuloVentaVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Artículos menú' && privilegio.permisos.includes('READ')) {
                        setArticuloMenuVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Stock' && privilegio.permisos.includes('READ')) {
                        setStockVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Stock entrante' && privilegio.permisos.includes('READ')) {
                        setStockEntranteVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Ingredientes' && privilegio.permisos.includes('READ')) {
                        setIngredientesVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Categorias' && privilegio.permisos.includes('READ')) {
                        setCategoriasVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Medidas' && privilegio.permisos.includes('READ')) {
                        setMedidasVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Promociones' && privilegio.permisos.includes('READ')) {
                        setPromocionesVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Subcategorias' && privilegio.permisos.includes('READ')) {
                        setSubcategoriasVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Estadísticas' && privilegio.permisos.includes('READ')) {
                        setEstadisticasVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Pedidos entrantes' && privilegio.permisos.includes('READ')) {
                        setPedidosEntrantesVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Pedidos aceptados' && privilegio.permisos.includes('READ')) {
                        setPedidosAceptadosVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Pedidos cocinados' && privilegio.permisos.includes('READ')) {
                        setPedidosCocinadosVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Pedidos entregados' && privilegio.permisos.includes('READ')) {
                        setPedidosEntregadosVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Pedidos en camino' && privilegio.permisos.includes('READ')) {
                        setPedidosEnCaminoVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Empleados' && privilegio.permisos.includes('READ')) {
                        setEmpleadosVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Sucursales' && privilegio.permisos.includes('READ')) {
                        setSucursalesVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Empresas' && privilegio.permisos.includes('READ')) {
                        setEmpresasVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Roles' && privilegio.permisos.includes('READ')) {
                        setRolesVisibleEmpleado(true);
                    } else if (privilegio.nombre === 'Privilegios' && privilegio.permisos.includes('READ')) {
                        setPrivilegiosVisibleEmpleado(true);
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (sucursal !== null && !DESACTIVAR_PRIVILEGIOS) {
            setArticuloVentaVisibleEmpleado(true);
            setArticuloMenuVisibleEmpleado(true);
            setStockVisibleEmpleado(true);
            setStockEntranteVisibleEmpleado(true);
            setIngredientesVisibleEmpleado(true);
            setCategoriasVisibleEmpleado(true);
            setMedidasVisibleEmpleado(true);
            setPromocionesVisibleEmpleado(true);
            setSubcategoriasVisibleEmpleado(true);
            setEstadisticasVisibleEmpleado(true);
            setEmpleadosVisibleEmpleado(true);
            setSucursalesVisibleEmpleado(false);
            setEmpresasVisibleEmpleado(false);
            setPedidosEntrantesVisibleEmpleado(true);
            setPedidosAceptadosVisibleEmpleado(true);
            setPedidosCocinadosVisibleEmpleado(true);
            setPedidosEntregadosVisibleEmpleado(true);
            setPedidosEnCaminoVisibleEmpleado(true);
            setRolesVisibleEmpleado(true);
            setPrivilegiosVisibleEmpleado(true);
        }
    }

    useEffect(() => {
        document.title = 'Administración y opciones';
    }, []);

    const handleModalClose = () => {
        setShowDecisionEmpresa(false);
    };

    const [sidebarBg, setSidebarBg] = useState('');
    const [showDecisionEmpresa, setShowDecisionEmpresa] = useState(false);

    return (
        <div className={`sidebar ${sidebarBg}`}>
            {showDecisionEmpresa && (
                <ModalFlotante isOpen={showDecisionEmpresa} onClose={handleModalClose}>
                    <div className="modal-info">
                        <>
                            <h2>¿Qué desea hacer?</h2>
                            <button onClick={() => { limpiarCredenciales; window.location.href = getBaseUrl() }}>Cerrar sesión</button>
                            <br />
                            <button onClick={() => { localStorage.removeItem('sucursal'); window.location.href = getBaseUrl() + '/empresa' }}>Volver a cuenta de empresa</button>
                        </>
                    </div>
                </ModalFlotante>
            )}
            <div className={`opciones-menu ${menuVisible ? 'hidden' : 'visible'}`}>
                <div className="title-header">
                    <img src="../src/assets/img/HatchfulExport-All/logo_transparent_header.png" alt="Logo" className="logo-opciones" onClick={() => window.location.href = 'http://localhost:5173/opciones'} />


                </div>

                <hr />
                <label id="label" className={`opciones-link ${opcionesBg}`} onClick={toggleOptionsVisibility}>
                    _opciones
                    {optionsIcon}
                </label>

                {optionsVisible && (
                    <>
                        {isVisible ? (
                            <div className="main-options">
                                <div className="pedidos">
                                    <h4 onClick={togglePedidosVisibility} className={opcionSeleccionada >= 1 && opcionSeleccionada <= 4 ? 'h4-selected' : ''}>
                                        Pedidos
                                        {pedidosIcon}
                                    </h4>
                                    {pedidosVisible && (
                                        <>
                                            {pedidosEntrantesVisibleEmpleado && (
                                                <p className={opcionSeleccionada === 1 ? 'selected' : ''} onClick={() => handleOpcionClick(1)}>
                                                    Pedidos entrantes
                                                </p>
                                            )}

                                            {pedidosAceptadosVisibleEmpleado && (
                                                <p className={opcionSeleccionada === 2 ? 'selected' : ''} onClick={() => handleOpcionClick(2)}>
                                                    Pedidos aceptados
                                                </p>
                                            )}

                                            {pedidosCocinadosVisibleEmpleado && (
                                                <p className={opcionSeleccionada === 3 ? 'selected' : ''} onClick={() => handleOpcionClick(3)}>
                                                    Pedidos para entregar
                                                </p>
                                            )}

                                            {pedidosEntregadosVisibleEmpleado && (
                                                <p className={opcionSeleccionada === 4 ? 'selected' : ''} onClick={() => handleOpcionClick(4)}>
                                                    Pedidos entregados
                                                </p>
                                            )}
                                            {pedidosEnCaminoVisibleEmpleado && (
                                                <p className={opcionSeleccionada === 19 ? 'selected' : ''} onClick={() => handleOpcionClick(19)}>
                                                    Pedidos en camino
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                {stockVisibleEmpleado && (
                                    <div className="stock">
                                        <h4 onClick={toggleStockVisibility} className={opcionSeleccionada >= 5 && opcionSeleccionada <= 6 ? 'h4-selected' : ''}>
                                            Stock
                                            {stockIcon}
                                        </h4>
                                        {stockVisible && (
                                            <>
                                                <p className={opcionSeleccionada === 5 ? 'selected' : ''} onClick={() => handleOpcionClick(5)}>
                                                    Stock
                                                </p>
                                                {stockEntranteVisibleEmpleado && (
                                                    <p className={opcionSeleccionada === 6 ? 'selected' : ''} onClick={() => handleOpcionClick(6)}>
                                                        Stock entrante
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {articuloMenuVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 7 ? 'selected' : ''} onClick={() => handleOpcionClick(7)}>
                                        Menú
                                    </h4>
                                )}


                                {articuloVentaVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 11 ? 'selected' : ''} onClick={() => handleOpcionClick(11)}>
                                        Articulos
                                    </h4>
                                )}

                                {rolesVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 20 ? 'selected' : ''} onClick={() => handleOpcionClick(20)}>
                                        Roles
                                    </h4>
                                )}

                                {empleadosVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 8 ? 'selected' : ''} onClick={() => handleOpcionClick(8)}>
                                        Empleados
                                    </h4>
                                )}

                                {sucursalesVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 9 ? 'selected' : ''} onClick={() => handleOpcionClick(9)}>
                                        Sucursales
                                    </h4>
                                )}


                                {ingredientesVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 10 ? 'selected' : ''} onClick={() => handleOpcionClick(10)}>
                                        Ingredientes
                                    </h4>
                                )}

                                {privilegiosVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 21 ? 'selected' : ''} onClick={() => handleOpcionClick(21)}>
                                        Privilegios
                                    </h4>
                                )}

                                {categoriasVisibleEmpleado && (
                                    <div className="categorias">
                                        <h4 onClick={toggleCategoriaVisibility} className={opcionSeleccionada >= 12 && opcionSeleccionada <= 13 ? 'h4-selected' : ''}>
                                            Categoria
                                            {categoriaIcon}
                                        </h4>
                                        {categoriaVisible && (
                                            <>
                                                <p className={opcionSeleccionada === 12 ? 'selected' : ''} onClick={() => handleOpcionClick(12)}>
                                                    Categoria
                                                </p>
                                                {subcategoriasVisibleEmpleado && (
                                                    <p className={opcionSeleccionada === 13 ? 'selected' : ''} onClick={() => handleOpcionClick(13)}>
                                                        Subcategoria
                                                    </p>
                                                )}

                                            </>
                                        )}
                                    </div>
                                )}

                                {medidasVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 14 ? 'selected' : ''} onClick={() => handleOpcionClick(14)}>
                                        Medidas
                                    </h4>
                                )}

                                {promocionesVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 16 ? 'selected' : ''} onClick={() => handleOpcionClick(16)}>
                                        Promociones
                                    </h4>
                                )}

                                {empresasVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 17 ? 'selected' : ''} onClick={() => handleOpcionClick(17)}>
                                        Empresas
                                    </h4>
                                )}

                                {estadisticasVisibleEmpleado && (
                                    <div className="reportes">
                                        <h4 onClick={toggleReportesVisibility} className={opcionSeleccionada >= 18 && opcionSeleccionada <= 18 ? 'h4-selected' : ''}>
                                            Reportes
                                            {stockIcon}
                                        </h4>
                                        {reportesVisible && (
                                            <>
                                                <p className={opcionSeleccionada === 18 ? 'selected' : ''} onClick={() => handleOpcionClick(18)}>
                                                    Reportes de ventas
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="main-options">
                                {pedidosAceptadosVisibleEmpleado && (
                                    <p className={opcionSeleccionada === 2 ? 'selected' : ''} onClick={() => handleOpcionClick(2)}>
                                        Pedidos aceptados
                                    </p>
                                )}

                                <p className={opcionSeleccionada === 5 ? 'selected' : ''} onClick={() => handleOpcionClick(5)}>
                                    Stock
                                </p>
                                <p className={opcionSeleccionada === 6 ? 'selected' : ''} onClick={() => handleOpcionClick(6)}>
                                    Stock entrante
                                </p>
                                <p className={opcionSeleccionada === 7 ? 'selected' : ''} onClick={() => handleOpcionClick(7)}>
                                    Menus
                                </p>
                                <p className={opcionSeleccionada === 11 ? 'selected' : ''} onClick={() => handleOpcionClick(11)}>
                                    Articulos
                                </p>
                                <p className={opcionSeleccionada === 10 ? 'selected' : ''} onClick={() => handleOpcionClick(10)}>
                                    Ingredientes
                                </p>
                                <p className={opcionSeleccionada === 16 ? 'selected' : ''} onClick={() => handleOpcionClick(16)}>
                                    Promociones
                                </p>
                            </div>
                        )}
                    </>
                )}
                <div className="spacer"></div>
                <div className="bottom-section">
                    <hr />
                    <label id="label" className={`ajustes-link ${settingsBg}`} onClick={toggleSettingsVisibility}>
                        _ajustes de cuenta
                        {settingsIcon}
                    </label>
                    {settingsVisible && (
                        <div className="settings">
                            <h4
                                className={opcionSeleccionada === 15 ? 'selected' : ''}
                                onClick={() => handleOpcionClick(15)}
                            >
                                Preferencias
                            </h4>
                        </div>
                    )}

                    <hr />
                    <div className="perfil-employee">
                        <PersonIcon style={{ fontSize: '38px', display: 'inline' }} />
                        <div className="account-info">
                            <label className="name-account">{empleado?.nombre}{sucursal?.nombre}{empresa?.nombre}</label>
                        </div>

                        {empresa ? (
                            <LogoutIcon onClick={() => setShowDecisionEmpresa(true)} className="logout-icon" style={{ fontSize: '38px', display: 'inline' }} />
                        ) : (
                            <LogoutIcon onClick={() => { limpiarCredenciales(); window.location.href = 'http://localhost:5173/login-negocio' }} className="logout-icon" style={{ fontSize: '38px', display: 'inline' }} />
                        )}
                    </div>
                </div>
            </div>

            <div className={`table-info ${menuVisible ? '' : 'expanded'}`} style={{ flex: 1 }}>
                {renderInformacion()}
            </div>
        </div>
    );
};

export default Opciones;
