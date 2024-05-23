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
    articuloOriginal.borrado = 'NO';
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
    <div className='modal-info'>
      <Toaster />
      <h2>¿Seguro que quieres activar el articulo?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarArticuloVenta;
