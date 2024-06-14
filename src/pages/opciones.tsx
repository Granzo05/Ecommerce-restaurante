import { lazy, useEffect, useState } from 'react';

import Stock from '../components/Stock/Stock';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Empleado } from '../types/Restaurante/Empleado';
import { useParams } from 'react-router-dom';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { getBaseUrl } from '../utils/global_variables/const';

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

    if ((sucursal && id) && (sucursal.id > 0 && parseInt(id) > 0) && sucursal.id !== parseInt(id)) {
        window.location.href = getBaseUrl() + '/opciones';
    }

    if ((id && empleado) && parseInt(id) !== empleado.sucursales[0].id) {
        console.log("EL EMPLEADO NO DEBERIA TENER ACCESO ACÁ")
        console.log("ID SUCURSAL" + id)
        console.log("ID SUCURSAL ASIGNADA AL EMPLEADO" + empleado.sucursales[0].id)
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
                    <h1 id="welcome">¡BIENVENIDO {empleado?.nombre}!</h1>
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
        }
    };

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [articuloVentaVisibleEmpleado, setArticuloVentaVisibleEmpleado] = useState(true);
    const [articuloMenuVisibleEmpleado, setArticuloMenuVisibleEmpleado] = useState(true);
    const [stockVisibleEmpleado, setStockVisibleEmpleado] = useState(true);
    const [stockEntranteVisibleEmpleado, setStockEntranteVisibleEmpleado] = useState(true);
    const [ingredientesVisibleEmpleado, setIngredientesVisibleEmpleado] = useState(true);
    const [categoriasVisibleEmpleado, setCategoriasVisibleEmpleado] = useState(true);
    const [medidasVisibleEmpleado, setMedidasVisibleEmpleado] = useState(true);
    const [promocionesVisibleEmpleado, setPromocionesVisibleEmpleado] = useState(true);
    const [subcategoriasVisibleEmpleado, setSubcategoriasVisibleEmpleado] = useState(true);
    const [estadisticasVisibleEmpleado, setEstadisticasVisibleEmpleado] = useState(true);
    const [pedidosVisibleEmpleado, setPedidosVisibleEmpleado] = useState(true);
    const [empleadosVisibleEmpleado, setEmpleadosVisibleEmpleado] = useState(true);
    const [sucursalesVisibleEmpleado, setSucursalesVisibleEmpleado] = useState(true);
    const [empresasVisibleEmpleado, setEmpresasVisibleEmpleado] = useState(true);

    const checkPrivilegies = async () => {
        try {
            empleado?.empleadoPrivilegios?.forEach(privilegio => {
                if (privilegio.privilegio.tarea === 'Articulos de venta' && privilegio.permisos.includes('READ')) {
                    setArticuloVentaVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Artículos menú' && privilegio.permisos.includes('READ')) {
                    setArticuloMenuVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Stock' && privilegio.permisos.includes('READ')) {
                    setStockVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Stock entrante' && privilegio.permisos.includes('READ')) {
                    setStockEntranteVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Ingredientes' && privilegio.permisos.includes('READ')) {
                    setIngredientesVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Categorias' && privilegio.permisos.includes('READ')) {
                    setCategoriasVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Medidas' && privilegio.permisos.includes('READ')) {
                    setMedidasVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Promociones' && privilegio.permisos.includes('READ')) {
                    setPromocionesVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Subcategorias' && privilegio.permisos.includes('READ')) {
                    setSubcategoriasVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Estadísticas' && privilegio.permisos.includes('READ')) {
                    setEstadisticasVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Pedidos' && privilegio.permisos.includes('READ')) {
                    setPedidosVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Empleados' && privilegio.permisos.includes('READ')) {
                    setEmpleadosVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Sucursales' && privilegio.permisos.includes('READ')) {
                    setSucursalesVisibleEmpleado(true);
                } else if (privilegio.privilegio.tarea === 'Empresas' && privilegio.permisos.includes('READ')) {
                    setEmpresasVisibleEmpleado(true);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        document.title = 'Administración y opciones';
    }, []);


    const [sidebarBg, setSidebarBg] = useState('');

    return (
        <div className={`sidebar ${sidebarBg}`}>
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
                                {pedidosVisibleEmpleado && (
                                    <div className="pedidos">
                                        <h4 onClick={togglePedidosVisibility} className={opcionSeleccionada >= 1 && opcionSeleccionada <= 4 ? 'h4-selected' : ''}>
                                            Pedidos
                                            {pedidosIcon}
                                        </h4>
                                        {pedidosVisible && (
                                            <>
                                                <p className={opcionSeleccionada === 1 ? 'selected' : ''} onClick={() => handleOpcionClick(1)}>
                                                    Pedidos entrantes
                                                </p>
                                                <p className={opcionSeleccionada === 2 ? 'selected' : ''} onClick={() => handleOpcionClick(2)}>
                                                    Pedidos aceptados
                                                </p>
                                                <p className={opcionSeleccionada === 3 ? 'selected' : ''} onClick={() => handleOpcionClick(3)}>
                                                    Pedidos para entregar
                                                </p>
                                                <p className={opcionSeleccionada === 4 ? 'selected' : ''} onClick={() => handleOpcionClick(4)}>
                                                    Pedidos entregados
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
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
                                        Menus
                                    </h4>
                                )}


                                {articuloVentaVisibleEmpleado && (
                                    <h4 className={opcionSeleccionada === 11 ? 'selected' : ''} onClick={() => handleOpcionClick(11)}>
                                        Articulos
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
                                <p className={opcionSeleccionada === 2 ? 'selected' : ''} onClick={() => handleOpcionClick(2)}>
                                    Pedidos aceptados
                                </p>
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
                            <label className="name-account">{empleado?.nombre}</label>
                        </div>

                        <LogoutIcon onClick={() => window.location.href = 'http://localhost:5173/login-negocio'} className="logout-icon" style={{ fontSize: '38px', display: 'inline' }} />
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
