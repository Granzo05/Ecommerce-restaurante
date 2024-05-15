import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { MenuService } from '../services/MenuService'
import ModalFlotante from '../components/ModalFlotante';
import { DetallesMenu } from '../components/Menus/DetallesMenu';
import '../styles/menuPorTipo.css'
import { convertirStringAEnumTipoComida } from '../utils/global_variables/functions';
import { ArticuloMenuDTO } from '../types/Productos/ArticuloMenuDTO';

function RestaurantesPorComida() {
  const { tipoComida } = useParams()

  const [menus, setMenus] = useState<ArticuloMenuDTO[]>([]);

  useEffect(() => {
    if (tipoComida) {
      MenuService.getMenusPorTipo(convertirStringAEnumTipoComida(tipoComida))
        .then(menus => {
          setMenus(menus);
        })
        .catch(error => {
          console.error("Error al obtener los menús:", error);
        });
    }
  }, [tipoComida]);

  const [showDetailsMenu, setShowDetailsMenuModal] = useState(false);

  const handleMostrarMenu = () => {
    setShowDetailsMenuModal(true);
  };

  const handleModalClose = () => {
    setShowDetailsMenuModal(false);
  };

  return (
    <div id="grid-container">
      {menus.length > 0 && menus.map((menu) => (
        <div key={menu.id} className="grid-item" onClick={handleMostrarMenu} style={{ width: '300px' }}>
          <img key={menu.imagenesDTO[0].nombre} src={menu.imagenesDTO[0].ruta} alt={menu.imagenesDTO[0].nombre} />
          <h2>{menu.nombre}</h2>
          <h2>${menu.precioVenta}</h2>
          <h2>Descripción: {menu.descripcion}</h2>
          <h2><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
            <path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 15 8 L 15 17 L 22 17 L 22 15 L 17 15 L 17 8 Z"></path>
          </svg>{menu.tiempoCoccion} minutos</h2>

          <ModalFlotante isOpen={showDetailsMenu} onClose={handleModalClose}>
            <DetallesMenu menuActual={menu} />
          </ModalFlotante>
        </div>
      ))
      }
    </div >


  );

}

export default RestaurantesPorComida;