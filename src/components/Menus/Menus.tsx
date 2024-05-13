import { MenuService } from "../../services/MenuService";
import { useEffect, useState } from 'react';
import ModalCrud from "../ModalCrud";
import AgregarMenu from './AgregarMenu';
import EditarMenu from './EditarMenu';
import EliminarMenu from "./EliminarMenu";
import '../../styles/menuPorTipo.css';
import '../../styles/modalCrud.css';
import '../../styles/modalFlotante.css';
import { ArticuloMenu } from "../../types/Productos/ArticuloMenu";
import { EmpleadoService } from "../../services/EmpleadoService";
import ModalFlotante from "../ModalFlotante";

const Menus = () => {
    const [menus, setMenus] = useState<ArticuloMenu[]>([]);
    const [mostrarMenus, setMostrarMenus] = useState(true);

    const [showAgregarMenuModal, setShowAgregarMenuModal] = useState(false);
    const [showEditarMenuModal, setShowEditarMenuModal] = useState(false);
    const [showEliminarMenuModal, setShowEliminarMenuModal] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState<ArticuloMenu | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(0);

    useEffect(() => {
        fetchData();

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
                    console.log(data)
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

    const handleEliminarMenu = (id: number) => {
        setSelectedId(id);
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(true);
        setMostrarMenus(false);
    };

    const handleModalClose = () => {
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
        setShowEliminarMenuModal(false);
        setMostrarMenus(true);
        fetchMenu();
    };

    return (
        <div className="opciones-pantallas">
            <h1>Menus</h1>
            <button onClick={() => handleAgregarMenu()}> + Agregar menu</button>
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
                            {menus.length > 0 && menus.map(menu => (
                                <tr key={menu.id}>
                                    <td>{menu.nombre}</td>
                                    <td>{menu.comensales}</td>
                                    <td>{menu.descripcion}</td>
                                    {menu.ingredientesMenu?.map(ingrediente => (
                                        <td key={ingrediente.id}>{ingrediente.ingrediente?.nombre}</td>
                                    ))}
                                    <td>{menu.precioVenta}</td>

                                    <td>
                                        <button onClick={() => handleEliminarMenu(menu.id)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarMenu(menu)}>EDITAR</button>
                                    </td>
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
                {selectedId && <EliminarMenu menuId={selectedId} />}
            </ModalFlotante>
       
        </div>

    )
}

export default Menus
