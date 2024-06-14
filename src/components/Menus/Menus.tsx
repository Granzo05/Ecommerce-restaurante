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

    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [activateVisible, setActivateVisible] = useState(false);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Articulos de venta' && privilegio.permisos.includes('READ')) {
                        if (privilegio.permisos.includes('CREATE')) {
                            setCreateVisible(true);
                        } else if (privilegio.permisos.includes('UPDATE')) {
                            setUpdateVisible(true);
                        } else if (privilegio.permisos.includes('DELETE')) {
                            setDeleteVisible(true);
                        } else if (privilegio.permisos.includes('ACTIVATE')) {
                            setActivateVisible(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
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
            <h1>- Menus -</h1>

            {createVisible && (
                <div className="btns-menu">
                    <button className="btn-agregar" onClick={() => handleAgregarMenu()}> + Agregar menu</button>
                </div>)}
            <hr />
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
                            {menus.length > 0 && menus.map(menu => (
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
