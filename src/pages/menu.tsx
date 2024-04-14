import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { MenuService } from '../services/MenuService'
import { Menu } from '../types/Menu'
import ModalFlotante from '../components/ModalFlotante';
import { DetallesMenu } from '../components/Menus/DetallesMenu';

function RestaurantesPorComida() {
  const { tipoComida } = useParams()

  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    if (tipoComida) {
      MenuService.getMenusPorTipo(tipoComida)
        .then(menus => {
          console.log(menus)
          setMenus(menus);
        })
        .catch(error => {
          console.error("Error al obtener los menús:", error);
        });
    }
  }, [tipoComida]);

  const [showDetailsMenu, setShowDetailsMenuModal] = useState(false);

  const handleAgregarStock = () => {
    setShowDetailsMenuModal(true);
  };

  const handleModalClose = () => {
    setShowDetailsMenuModal(false);
  };

  return (
    <div id="grid-container">
      {menus.map((menu) => (
        <div key={menu.id} className="grid-item">
          <img key={menu.imagenes[0].fileName} src={'http://localhost:8080/' + menu.nombre.replace(/\s+/g, '') + '/' + menu.imagenes[0].fileName} alt={menu.imagenes[0].fileName} />
          <h2>{menu.nombre}</h2>
          <h2>${menu.precio}</h2>
          <h2>Descripción: {menu.descripcion}</h2>
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" /></svg>{menu.comensales}</h2>
          <h2>Ingredientes:</h2>
          <ul>
            {menu.ingredientesMenu.map((ingredienteMenu, index) => (
              <li key={index}>* {ingredienteMenu.ingrediente.nombre}</li>
            ))}
          </ul>
          <h2>Tiempo de cocción: {menu.tiempoCoccion}</h2>
          <button onClick={() => handleAgregarStock()}>Cargar nuevo ingrediente</button>
          <ModalFlotante isOpen={showDetailsMenu} onClose={handleModalClose}>
            <DetallesMenu menuActual={menu} />
          </ModalFlotante>
        </div>
      ))}
    </div>


  );

}

export default RestaurantesPorComida;