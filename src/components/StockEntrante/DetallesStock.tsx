import '../../styles/modalFlotante.css';
import { DetalleStock } from '../../types/Stock/DetalleStock';

interface Props {
  detallesOriginal: DetalleStock[];
}

export const DetallesStock: React.FC<Props> = ({ detallesOriginal }) => {
  return (
    <div id="grid-container-modal">
      {detallesOriginal.length > 0 && detallesOriginal.map(detalle => (
        <div key={detalle.id} className="grid-item-modal">
          <h2>{detalle.nombre}</h2>
          <p>{detalle.precioVenta}</p>
          <p>{detalle.descripcion}</p>
        </div>
      ))}
    </div>
  );
}

export default DetallesStock;
