import Carousel from 'react-bootstrap/Carousel';
import '../../styles/modalFlotante.css';
import { useState } from 'react';
import { CarritoService } from '../../services/CarritoService';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';

interface Props {
  menuActual: ArticuloMenu;
}

export const DetallesMenu: React.FC<Props> = ({ menuActual }) => {
  const imagenesInvertidas = [...menuActual.imagenes].reverse();
  const [cantidadMenu, setCantidadMenu] = useState<number>(0);


  async function handleAñadirCarrito(menu: ArticuloMenu) {
    await CarritoService.agregarAlCarrito(menu, cantidadMenu);
  }

  return (
    <div id="grid-container-modal">
      <div key={menuActual.id} className="grid-item-modal">
        <Carousel>
          {imagenesInvertidas.map((imagen, index) => (
            <Carousel.Item key={index} interval={4000}>
              <img src={imagen.ruta} />
            </Carousel.Item>
          ))}
        </Carousel>
        <h2>{menuActual.nombre}</h2>
        <p>${menuActual.precioVenta}</p>
        <p>Descripción: {menuActual.descripcion}</p>
        <h2><svg xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" /></svg>{menuActual.comensales}</h2>
        <p>Ingredientes:</p>
        <ul>
          {menuActual.ingredientesMenu?.map((ingredienteMenu, index) => (
            <li key={index}>* {ingredienteMenu.ingrediente?.nombre}</li>
          ))}
        </ul>
        <p>Tiempo de cocción: {menuActual.tiempoCoccion}</p>

        <input type="number" onChange={(e) => { setCantidadMenu(parseInt(e.target.value)) }} />
        <button type='submit' onClick={() => handleAñadirCarrito(menuActual)}>Añadir al carrito</button>
      </div>
    </div>
  );

}

export default DetallesMenu;