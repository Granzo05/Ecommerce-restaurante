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
    <div className="modal-container">
      {detallesOriginal.length > 0 && detallesOriginal.map(detalle => (
        <div key={detalle.id} className="detalle-item">
          
          <h2 className="detalle-title"><strong>Stock:</strong> {detalle.articuloVenta?.nombre || detalle.ingrediente?.nombre}</h2>
          <p className="detalle-info"><strong>Cantidad:</strong> {detalle.cantidad} {detalle.medida?.nombre.toString().replace(/_/g, ' ')}</p>
          <p className="detalle-info"><strong>Costo por unidad:</strong> ${detalle.costoUnitario.toLocaleString('es-AR')}</p>
          <p className="detalle-info"><strong>Subtotal:</strong> ${(detalle.cantidad * detalle.costoUnitario).toLocaleString('es-AR')}</p>
          <hr />
        </div>
      ))}
      <h2 className="total"><strong>Total: ${total.toLocaleString('es-AR')}</strong></h2>
    </div>
  );
}

export default DetallesStock;

