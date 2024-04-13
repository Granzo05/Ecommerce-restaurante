import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { MenuService } from '../services/MenuService'
import { Menu } from '../types/Menu'

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

  return (
    <div id="grid-container">
      {menus.map((menu) => (
        <div key={menu.id} className="grid-item">
          {menu.imagenes.map((imagen) => (
            <img key={imagen.fileName} src={'http://localhost:8080/' + menu.nombre.replace(' ', '') + '/' + imagen.fileName} alt={imagen.fileName} />
          ))}
          <h2>{menu.nombre}</h2>
          <h2>${menu.precio}</h2>
          <h2>Descripción: {menu.descripcion}</h2>
          <h2>Comensales: {menu.comensales}</h2>
          <h2>Ingredientes:</h2>
          <ul>
            {menu.ingredientesMenu.map((ingredienteMenu, index) => (
              <li key={index}>* {ingredienteMenu.ingrediente.nombre}</li>
            ))}
          </ul>
          <h2>Tiempo de cocción: {menu.tiempoCoccion}</h2>
        </div>
      ))}
    </div>
  );

}

export default RestaurantesPorComida;