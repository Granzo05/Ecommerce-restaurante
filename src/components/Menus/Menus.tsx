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
    const [productosMostrables, setProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * productosMostrables;
    const indexPrimerProducto = indexUltimoProducto - productosMostrables;

    // Obtener los elementos de la página actual
    const menusFiltrados = menus.slice(indexPrimerProducto, indexUltimoProducto);

    const paginasTotales = Math.ceil(menus.length / productosMostrables);

    // Cambiar de página
    const paginate = (paginaActual: number) => setPaginaActual(paginaActual);

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
                    <select id="cantidad" name="cantidadProductos" value={productosMostrables} onChange={(e) => setProductosMostrables(parseInt(e.target.value))}>
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
                        />
                        <span>Filtrar por nombre</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="number"
                            required
                        />
                        <span>Filtrar por tiempo</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="number"
                            required
                        />
                        <span>Filtrar por precio</span>
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="text"
                            required
                        />
                        <span>Filtrar por tipo</span>
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
                            {menusFiltrados.length > 0 && menus.map(menu => (
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
                                    <td>{menu.categoria.nombre}</td>

                                    {menu.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones-stock">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarMenu(menu)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarMenu(menu)}>ELIMINAR</button>
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
