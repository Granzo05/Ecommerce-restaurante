import '../../styles/modalFlotante.css';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';

interface Props {
  selectedMenu: ArticuloMenu;
}

export const DetallesMenu: React.FC<Props> = ({ selectedMenu }) => {

  return (
    <div id="modal-container">
      <div key={selectedMenu.id} className="detalle-item">
        <ul>
          <>
            <h2 className="detalle-title"><strong>{selectedMenu?.nombre}</strong></h2>
            <h2 className="detalle-title"><strong>Ingredientes:</strong></h2>
            {selectedMenu?.ingredientesMenu?.map(ingrediente => (
              <>
                <li className="detalle-info" key={ingrediente.ingrediente.id}>{ingrediente.ingrediente?.nombre} - {ingrediente.cantidad} {ingrediente.medida.nombre}</li>
              </>
            ))}
            <p className="detalle-info"><strong>Tiempo de cocción:</strong> {selectedMenu?.tiempoCoccion} minutos</p>
          </>
        </ul>
      </div>
    </div>
  );

}

export default DetallesMenu;