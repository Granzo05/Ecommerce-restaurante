import { MenuService } from "../../services/MenuService";
import { useEffect, useState } from 'react';
import { Menu } from "../../types/Menu";
import ModalCrud from "../ModalCrud";
import AgregarMenu from './AgregarMenu';
import EditarMenu from './EditarMenu';
import EliminarMenu from "./EliminarMenu";
import '../../styles/menuPorTipo.css';
import '../../styles/modalCrud.css';
import '../../styles/modalFlotante.css';
import { EmpleadoService } from "../../services/EmpleadoService";

const Menus = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [mostrarMenus, setMostrarMenus] = useState(true);

    const [showAgregarMenuModal, setShowAgregarMenuModal] = useState(false);
    const [showEditarMenuModal, setShowEditarMenuModal] = useState(false);
    const [showEliminarMenuModal, setShowEliminarMenuModal] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await EmpleadoService.checkUser('negocio');
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        MenuService.getMenus()
            .then(data => {
                setMenus(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);


    const handleAgregarMenu = () => {
        setShowAgregarMenuModal(true);
        setMostrarMenus(false);
    };

    const handleEditarMenu = (menu: Menu) => {
        setSelectedMenu(menu);
        setShowEditarMenuModal(true);
        setMostrarMenus(false);
    };

    const handleEliminarMenu = (menuId: number) => {
        setSelectedId(menuId);
        setShowEliminarMenuModal(true);
        setMostrarMenus(false);
    };

    const handleModalClose = () => {
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(false);
        setMostrarMenus(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>Menus</h1>
            <button onClick={() => handleAgregarMenu()}> + Agregar menu</button>

            <ModalCrud isOpen={showAgregarMenuModal} onClose={handleModalClose}>
                <AgregarMenu />
            </ModalCrud>
            {mostrarMenus && (
                <div id="menus">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Comensales</th>
                                <th>Descripcion</th>
                                <th>Ingredientes</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.map(menu => (
                                <tr key={menu.id}>
                                    <td>{menu.nombre}</td>
                                    <td>{menu.comensales}</td>
                                    <td>{menu.descripcion}</td>
                                    {menu.ingredientesMenu.map(ingrediente => (
                                        <td>{ingrediente.ingrediente.nombre}</td>
                                    ))}
                                    <td>{menu.precio}</td>

                                    <td>
                                        <button onClick={() => handleEliminarMenu(menu.id)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarMenu}>EDITAR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ModalCrud isOpen={showEliminarMenuModal} onClose={handleModalClose}>
                        {selectedId && <EliminarMenu menuId={selectedId} />}
                    </ModalCrud>
                    <ModalCrud isOpen={showEditarMenuModal} onClose={handleModalClose}>
                        {selectedMenu && <EditarMenu menuOriginal={selectedMenu} />}
                    </ModalCrud>
                </div>
            )}
        </div>
    )
}

export default Menus
