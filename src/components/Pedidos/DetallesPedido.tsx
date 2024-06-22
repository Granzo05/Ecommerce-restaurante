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
              <h2 className="detalle-title"><strong>Ingredientes:</strong></h2>
              <li className="detalle-info" key={detalle.id}>{detalle.articuloMenu?.nombre}</li>
              <p className="detalle-info"><strong>Tiempo de cocción:</strong> {detalle.articuloMenu?.tiempoCoccion} minutos</p>
            </>
          ))}
        </ul>
      </div>
    </div>
  );

}

export default DetallesPedido;