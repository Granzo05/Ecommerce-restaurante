import '../../styles/modalFlotante.css';
import { Pedido } from '../../types/Pedidos/Pedido';

interface Props {
  pedido: Pedido;
}

export const DetallesPedido: React.FC<Props> = ({ pedido }) => {

  return (
    <div id="modal-container">
      <div key={pedido.id} className="detalle-item">
        <ul>
          {pedido.detallesPedido?.map(detalle => (
            <>
              <h2 className="detalle-title"><strong>Menu: {detalle.articuloMenu?.nombre}</strong></h2>
              <h2 className="detalle-title"><strong>Ingredientes:</strong></h2>
              {detalle.articuloMenu?.ingredientesMenu?.map(ingrediente => (
                <>
                  <li className="detalle-info" key={ingrediente.ingrediente.nombre}>{ingrediente.ingrediente?.nombre}</li>
                  <li className="detalle-info">{ingrediente.cantidad} {ingrediente.medida.nombre}</li>
                </>
              ))}
              <p className="detalle-info"><strong>Tiempo de cocción:</strong> {detalle.articuloMenu?.tiempoCoccion} minutos</p>
            </>
          ))}
        </ul>
      </div>
    </div>
  );

}

export default DetallesPedido;