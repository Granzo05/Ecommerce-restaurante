import '../../styles/modalFlotante.css';
import { Pedido } from '../../types/Pedidos/Pedido';

interface Props {
  pedido: Pedido;
}

export const DetallesPedido: React.FC<Props> = ({ pedido }) => {

  return (
    <div id="grid-container-modal">
      <div key={pedido.id} className="grid-item-modal">
        <ul>
          {pedido.detallesPedido?.map(detalle => (
            <>
              <p>Ingredientes:</p>
              <li key={detalle.id}>{detalle.articuloMenu?.nombre}</li>
              <p>Tiempo de cocción: {detalle.articuloMenu?.tiempoCoccion} minutos</p>
            </>
          ))}
        </ul>
      </div>
    </div>
  );

}

export default DetallesPedido;