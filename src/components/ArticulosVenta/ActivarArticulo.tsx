import React from 'react';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';

interface ActivarArticuloProps {
  articuloOriginal: ArticuloVenta;
  onCloseModal: () => void;
}

const ActivarArticuloVenta: React.FC<ActivarArticuloProps> = ({ articuloOriginal, onCloseModal }) => {
  const onConfirm = () => {
    toast.promise(ArticuloVentaService.updateBorradoArticulo(articuloOriginal), {
      loading: 'Activando articulo...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  const onCancel = () => {
    onCloseModal();
  };

  return (
    <div>
      <Toaster />
      <p>¿Seguro que quieres activar el articulo?</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default ActivarArticuloVenta;
