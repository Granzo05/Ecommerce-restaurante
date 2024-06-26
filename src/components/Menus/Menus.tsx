import { MenuService } from "../../services/MenuService";
import { useEffect, useState } from 'react';
import ModalCrud from "../ModalCrud";
import AgregarMenu from './AgregarMenu';
import EditarMenu from './EditarMenu';
import EliminarMenu from "./EliminarMenu";
import '../../styles/menuPorTipo.css';
import '../../styles/modalCrud.css';
import '../../styles/modalFlotante.css';
import ActivarMenu from "./ActivarMenu";
import { ArticuloMenu } from "../../types/Productos/ArticuloMenu";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import { Sucursal } from "../../types/Restaurante/Sucursal";

const Menus = () => {
    const [menus, setMenus] = useState<ArticuloMenu[]>([]);
    const [mostrarMenus, setMostrarMenus] = useState(true);

    const [showAgregarMenuModal, setShowAgregarMenuModal] = useState(false);
    const [showEditarMenuModal, setShowEditarMenuModal] = useState(false);
    const [showEliminarMenuModal, setShowEliminarMenuModal] = useState(false);
    const [showActivarMenuModal, setShowActivarMenuModal] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState<ArticuloMenu>();

    useEffect(() => {
        setDatosFiltrados([]);
        fetchMenu();
    }, []);

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');

        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);

    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<ArticuloMenu[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > menus.length) {
            setPaginasTotales(1);
            setDatosFiltrados(menus);
        } else {
            setPaginasTotales(Math.ceil(menus.length / cantidad));
            setDatosFiltrados(menus.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarNombre(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = menus.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(menus.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(menus.length / cantidadProductosMostrables));
        }
    }

    const [signoTiempo, setSignoTiempo] = useState('>');

    function filtrarTiempo(filtro: number) {
        const comparadores: { [key: string]: (a: number, b: number) => boolean } = {
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '=': (a, b) => a === b
        };

        if (filtro > 0 && comparadores[signoTiempo]) {
            const filtradas = menus.filter(recomendacion =>
                comparadores[signoTiempo](recomendacion.tiempoCoccion, filtro)
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(menus.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(menus.length / cantidadProductosMostrables));
        }
    }

    const [precioBuscado, setPrecioBuscado] = useState<number>(0);
    const [signoPrecio, setSignoPrecio] = useState('>');

    useEffect(() => {
        filtrarPrecio();
    }, [signoPrecio, precioBuscado]);

    function filtrarPrecio() {
        const comparadores: { [key: string]: (a: number, b: number) => boolean } = {
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '=': (a, b) => a === b
        };

        if (precioBuscado > 0 && comparadores[signoPrecio] && datosFiltrados.length > 0) {
            setDatosFiltrados(datosFiltrados.filter(recomendacion =>
                comparadores[signoPrecio](recomendacion.precioVenta, precioBuscado)
            ));
            setPaginasTotales(Math.ceil(datosFiltrados.length / cantidadProductosMostrables));
        } else if (precioBuscado > 0 && menus.length > 0) {
            setDatosFiltrados(menus.filter(recomendacion =>
                comparadores[signoPrecio](recomendacion.precioVenta, precioBuscado)
            ));
            setPaginasTotales(Math.ceil(datosFiltrados.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(menus.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(menus.length / cantidadProductosMostrables));
        }
    }

    function filtrarCategoria(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = menus.filter(recomendacion =>
                recomendacion.categoria.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(menus.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(menus.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (menus.length > 0) {
            setDatosFiltrados(menus.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [menus, paginaActual, cantidadProductosMostrables]);

    async function checkPrivilegies() {
        if (empleado && empleado.privilegios?.length > 0) {
            try {
                empleado?.privilegios?.forEach(privilegio => {
                    if (privilegio.nombre === 'Empleados' && privilegio.permisos.includes('READ')) {
                        if (privilegio.permisos.includes('CREATE')) {
                            setCreateVisible(true);
                        }
                        if (privilegio.permisos.includes('UPDATE')) {
                            setUpdateVisible(true);
                        }
                        if (privilegio.permisos.includes('DELETE')) {
                            setDeleteVisible(true);
                        }
                        if (privilegio.permisos.includes('ACTIVATE')) {
                            setActivateVisible(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (sucursal && sucursal.id > 0) {
            setCreateVisible(true);
            setActivateVisible(true);
            setDeleteVisible(true);
            setUpdateVisible(true);
        }
    }

    const fetchMenu = async () => {
        setDatosFiltrados([]);
        try {
            MenuService.getMenus()
                .then(data => {
                    setMenus(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };

    const handleAgregarMenu = () => {
        setShowAgregarMenuModal(true);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(false);
        setMostrarMenus(false);
    };

    const handleEditarMenu = (menu: ArticuloMenu) => {
        setSelectedMenu(menu);
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(true);
        setShowEliminarMenuModal(false);
        setMostrarMenus(false);
    };

    const handleEliminarMenu = (menu: ArticuloMenu) => {
        setSelectedMenu(menu);
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(true);
        setShowActivarMenuModal(false);
        setMostrarMenus(false);
    };

    const handleActivarMenu = (menu: ArticuloMenu) => {
        setSelectedMenu(menu);
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(false);
        setShowActivarMenuModal(true);
        setMostrarMenus(false);
    };

    const handleModalClose = () => {
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(false);
        setShowActivarMenuModal(false);
        setMostrarMenus(true);
        fetchMenu();
    };

    useEffect(() => {
        if (menus.length > 0) cantidadDatosMostrables(11);
    }, [menus]);

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Menú -</h1>

            {createVisible && (
                <div className="btns-menu">
                    <button className="btn-agregar" onClick={() => handleAgregarMenu()}> + Agregar menu</button>
                </div>)}
            <hr />

            <div className="filtros">
                <div className="inputBox-filtrado">
                    <select id="cantidad" name="cantidadProductos" value={cantidadProductosMostrables} onChange={(e) => cantidadDatosMostrables(parseInt(e.target.value))}>
                        <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="filtros-datos">
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarNombre(e.target.value)}
                        />
                        <span>Filtrar por nombre</span>
                    </div>
                    <div className="inputBox-filtrado" >
                        <input
                            type="number"
                            required
                            onChange={(e) => filtrarTiempo(parseInt(e.target.value))}
                        />
                        <span>Filtrar por tiempo</span>

                    </div>
                    <div className="inputBox-filtrado" style={{ marginLeft: '-15px', marginRight: '10px' }}>
                        <select id="signos" name="signo" value={signoTiempo} onChange={(e) => setSignoTiempo(e.target.value)}>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                            <option value="=">=</option>
                        </select>
                    </div>

                    <div className="inputBox-filtrado">
                        <input
                            type="number"
                            required
                            onChange={(e) => setPrecioBuscado(parseInt(e.target.value))}
                        />
                        <span>Filtrar por precio</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginLeft: '-15px', marginRight: '10px' }}>
                        <select id="signos" name="signo" value={signoPrecio} onChange={(e) => setSignoPrecio(e.target.value)}>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                            <option value="=">=</option>
                        </select>
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarCategoria(e.target.value)}
                        />
                        <span>Filtrar por categoría</span>
                    </div>

                </div>


            </div>
            {mostrarMenus && (
                <div id="menus">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tiempo de cocción</th>
                                <th>Comensales</th>
                                <th>Descripcion</th>
                                <th>Ingredientes</th>
                                <th>Precio</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.length > 0 && menus.map(menu => (
                                <tr key={menu.id}>
                                    <td>{menu.nombre}</td>
                                    <td>{menu.tiempoCoccion} minutos</td>
                                    <td>{menu.comensales}</td>
                                    <td>{menu.descripcion}</td>
                                    <td>
                                        {menu.ingredientesMenu?.map((ingrediente, index) => (
                                            <span key={index}>
                                                {ingrediente.ingrediente.nombre} - {ingrediente.cantidad} {ingrediente.medida.nombre.toString().replace(/_/g, ' ')}<br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>${menu.precioVenta}</td>
                                    <td>{capitalizeFirstLetter(menu.categoria.nombre)}</td>

                                    {menu.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarMenu(menu)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarMenu(menu)}>ELIMINAR</button>
                                                )}
                                                {!updateVisible && !deleteVisible && (
                                                    <p>No tenes privilegios para interactuar con estos datos</p>
                                                )}
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarMenu(menu)}>ACTIVAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarMenu(menu)}>EDITAR</button>
                                                )}
                                                {!updateVisible && !activateVisible && (
                                                    <p>No tenes privilegios para interactuar con estos datos</p>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: paginasTotales }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} disabled={paginaActual === index + 1}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <ModalCrud isOpen={showAgregarMenuModal} onClose={handleModalClose}>
                <AgregarMenu onCloseModal={handleModalClose} />
            </ModalCrud>
            <ModalCrud isOpen={showEditarMenuModal} onClose={handleModalClose}>
                {selectedMenu && <EditarMenu menuOriginal={selectedMenu} onCloseModal={handleModalClose} />}
            </ModalCrud>
            <ModalCrud isOpen={showEliminarMenuModal} onClose={handleModalClose}>
                {selectedMenu && <EliminarMenu menuOriginal={selectedMenu} onCloseModal={handleModalClose} />}
            </ModalCrud>
            <ModalCrud isOpen={showActivarMenuModal} onClose={handleModalClose}>
                {selectedMenu && <ActivarMenu menuOriginal={selectedMenu} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>

    )
}

export default Menus
