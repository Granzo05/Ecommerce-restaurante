import Carousel from 'react-bootstrap/Carousel';
import '../../styles/modalFlotante.css';
import { useState } from 'react';
import { CarritoService } from '../../services/CarritoService';
import { ArticuloMenuDTO } from '../../types/Productos/ArticuloMenuDTO';
import { DetalleStock } from '../../types/Stock/DetalleStock';

interface Props {
  detallesOriginal: DetalleStock;
}

export const DetallesStock: React.FC<Props> = ({ detallesOriginal }) => {
  const [cantidadMenu, setCantidadMenu] = useState<number>(1);

  return (
    <div id="grid-container-modal">
      {detallesOriginal && detallesOriginal}
      <div key={detallesOriginal.id} className="grid-item-modal">
        <h2>{menuActual.nombre}</h2>
        <p>${menuActual.precioVenta}</p>
        <p>Descripción: {menuActual.descripcion}</p>
        <h2><svg xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" /></svg>{menuActual.comensales}</h2>
        <p>Ingredientes:</p>
        <ul>
          {menuActual.ingredientesMenu?.map((ingredienteMenu, index) => (
            <li key={index}>* {ingredienteMenu.ingredienteNombre}</li>
          ))}
        </ul>
        <p>Tiempo de cocción: {menuActual.tiempoCoccion} minutos</p>

        <div className="inputBox">
          <input type="number" required={true} value={cantidadMenu} onChange={(e) => { setCantidadMenu(parseInt(e.target.value)) }} />
          <span>Cantidad</span>
        </div>
        <button type='submit' onClick={() => handleAñadirCarrito(menuActual)}>Añadir al carrito</button>
      </div>
    </div>
  );

}

export default DetallesMenu;