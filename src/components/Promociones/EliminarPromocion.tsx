import React from 'react';
import { toast, Toaster } from 'sonner';
import { Promocion } from '../../types/Productos/Promocion';
import { PromocionService } from '../../services/PromocionService';

interface EliminarPromocionProps {
  promocion: Promocion;
  onCloseModal: () => void;

}

const EliminarPromocion: React.FC<EliminarPromocionProps> = ({ promocion, onCloseModal }) => {
  const onConfirm = () => {
    promocion.borrado = 'SI';
    toast.promise(PromocionService.updatePromocionBorrado(promocion), {
      loading: 'Eliminando promocion...',
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
    <div className="modal-info">
      <Toaster />
      <p>¿Seguro que quieres eliminar la promocion?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarPromocion;
