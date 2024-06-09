import { useEffect, useState } from 'react';
import '../../styles/modalFlotante.css';
import { DetalleStock } from '../../types/Stock/DetalleStock';

interface Props {
  detallesOriginal: DetalleStock[];
}

export const DetallesStock: React.FC<Props> = ({ detallesOriginal }) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const newTotal = detallesOriginal.reduce((acc, detalle) => acc + detalle.cantidad * detalle.costoUnitario, 0);
    setTotal(newTotal);
  }, [detallesOriginal]);

  return (
    <div id="grid-container-modal">
      {detallesOriginal.length > 0 && detallesOriginal.map(detalle => (
        <div key={detalle.id} className="grid-item-modal">
          <h2>{detalle.articuloVenta?.nombre}</h2>
          <h2>{detalle.ingrediente?.nombre}</h2>
          <p>Cantidad: {detalle.cantidad} {detalle.medida?.nombre.toString().replace(/_/g, ' ')}</p>
          <p>Costo por unidad: ${detalle.costoUnitario.toLocaleString('es-AR')}</p>
          <p>Subtotal: ${(detalle.cantidad * detalle.costoUnitario).toLocaleString('es-AR')}</p>
        </div>
      ))}

      {/* Formatear el total */}
      <h2>Total: ${total.toLocaleString('es-AR')}</h2>
    </div>
  );
}

export default DetallesStock;
