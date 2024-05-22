import { MenuService } from "../../services/MenuService";
import { useEffect, useState } from 'react';
import ModalCrud from "../ModalCrud";
import AgregarMenu from './AgregarMenu';
import EditarMenu from './EditarMenu';
import EliminarMenu from "./EliminarMenu";
import '../../styles/menuPorTipo.css';
import '../../styles/modalCrud.css';
import '../../styles/modalFlotante.css';
import { EmpleadoService } from "../../services/EmpleadoService";
import ModalFlotante from "../ModalFlotante";
import { ArticuloMenuDTO } from "../../types/Productos/ArticuloMenuDTO";
import ActivarMenu from "./ActivarMenu";

const Menus = () => {
    const [menus, setMenus] = useState<ArticuloMenuDTO[]>([]);
    const [mostrarMenus, setMostrarMenus] = useState(true);

    const [showAgregarMenuModal, setShowAgregarMenuModal] = useState(false);
    const [showEditarMenuModal, setShowEditarMenuModal] = useState(false);
    const [showEliminarMenuModal, setShowEliminarMenuModal] = useState(false);
    const [showActivarMenuModal, setShowActivarMenuModal] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState<ArticuloMenuDTO | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchData = async () => {
        try {
            await EmpleadoService.checkUser();
        } catch (error) {
            console.error('Error:', error);
        }
    };

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

    const handleEditarMenu = (menu: ArticuloMenuDTO) => {
        setSelectedMenu(menu);
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(true);
        setShowEliminarMenuModal(false);
        setMostrarMenus(false);
    };

    const handleEliminarMenu = (menu: ArticuloMenuDTO) => {
        menu.borrado = 'SI';
        setSelectedMenu(menu);
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(true);
        setShowActivarMenuModal(false);
        setMostrarMenus(false);
    };

    const handleActivarMenu = (menu: ArticuloMenuDTO) => {
        menu.borrado = 'NO';
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
            <div className="btns-menu">
                <button className="btn-agregar" onClick={() => handleAgregarMenu()}> + Agregar menu</button>
            </div>

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
                                    <td>{menu.tiempoCoccion}</td>
                                    <td>{menu.comensales}</td>
                                    <td>{menu.descripcion}</td>
                                    <td>
                                        {menu.ingredientesMenu?.map((ingrediente, index) => (
                                            <span key={index}>
                                                {ingrediente.ingredienteNombre} - {ingrediente.cantidad} {ingrediente.medida}<br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>{menu.precioVenta}</td>
                                    <td>{menu.tipo}</td>

                                    {menu.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones-stock">

                                            <button className="btn-accion-editar" onClick={() => handleEditarMenu(menu)}>EDITAR</button>
                                            
                                            <button className="btn-accion-eliminar" onClick={() => handleEliminarMenu(menu)}>ELIMINAR</button>
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones-stock">

                                            <button className="btn-accion-activar" onClick={() => handleActivarMenu(menu)}>ACTIVAR</button>
                                            <button className="btn-accion-editar" onClick={() => handleEditarMenu(menu)}>EDITAR</button>
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
                <AgregarMenu />
            </ModalCrud>
            <ModalFlotante isOpen={showEditarMenuModal} onClose={handleModalClose}>
                {selectedMenu && <EditarMenu menuOriginal={selectedMenu} />}
            </ModalFlotante>
            <ModalFlotante isOpen={showEliminarMenuModal} onClose={handleModalClose}>
                {selectedMenu && <EliminarMenu menuOriginal={selectedMenu} onCloseModal={handleModalClose} />}
            </ModalFlotante>
            <ModalFlotante isOpen={showActivarMenuModal} onClose={handleModalClose}>
                {selectedMenu && <ActivarMenu menuOriginal={selectedMenu} onCloseModal={handleModalClose} />}
            </ModalFlotante>
        </div>

    )
}

export default Menus
