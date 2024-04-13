import { MenuService } from "../../services/MenuService";
import { useEffect, useState } from 'react';
import { Menu } from "../../types/Menu";
import ModalCrud from "../ModalCrud";
import AgregarMenu from './AgregarMenu';
import EditarMenu from './EditarMenu';
import EliminarMenu from "./EliminarMenu";


const Menus = () => {
    const [menus, setMenus] = useState<Menu[]>([]);

    const [showAgregarMenuModal, setShowAgregarMenuModal] = useState(false);
    const [showEditarMenuModal, setShowEditarMenuModal] = useState(false);
    const [showEliminarMenuModal, setShowEliminarMenuModal] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(0);

    useEffect(() => {
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
    };

    const handleEditarMenu = (menu: Menu) => {
        setSelectedMenu(menu);
        setShowEditarMenuModal(true);
    };

    const handleEliminarMenu = (menuId: number) => {
        setSelectedId(menuId);
        setShowEliminarMenuModal(true);
    };

    const handleModalClose = () => {
        setShowAgregarMenuModal(false);
        setShowEditarMenuModal(false);
    };

    /*
    <div id="menus">
                {menus.map(menu => (
                    <div key={menu.id} className="grid-item">
                        
       

                        <h3>{menu.nombre}</h3>
                        <h3>{menu.comensales}</h3>
                        <h3>{menu.descripcion}</h3>
                        {menu.ingredientesMenu.map(ingrediente => (
                            <div>
                                <h4>{ingrediente.ingrediente.nombre} = X{ingrediente.cantidad}</h4>
                            </div>
                        ))}
                        <h3>{menu.precio}</h3>
                        <button onClick={() => handleEliminarMenu(menu.id)}>ELIMINAR</button>
                        <ModalCrud isOpen={showEliminarMenuModal} onClose={handleModalClose}>
                            {selectedId && <EliminarMenu menuId={selectedId} />}
                        </ModalCrud>
                        <button onClick={() => handleEditarMenu}>EDITAR</button>
                        <ModalCrud isOpen={showEditarMenuModal} onClose={handleModalClose}>
                            {selectedMenu && <EditarMenu menuOriginal={selectedMenu} />}
                        </ModalCrud>
                    </div>
                ))}
            </div>
    */

    return (
        <div className="opciones-pantallas">

            <h1>Menus</h1>
            <button onClick={() => handleAgregarMenu()}> + Agregar menu</button>

            <ModalCrud isOpen={showAgregarMenuModal} onClose={handleModalClose}>
                <AgregarMenu />
            </ModalCrud>


        </div>
    )
}

export default Menus
