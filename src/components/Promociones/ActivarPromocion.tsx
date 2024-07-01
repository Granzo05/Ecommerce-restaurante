import React from 'react';
import { toast, Toaster } from 'sonner';
import { Promocion } from '../../types/Productos/Promocion';
import { PromocionService } from '../../services/PromocionService';

interface ActivarPromocionProps {
  promocion: Promocion;
  onCloseModal: () => void;

}

const ActivarPromocion: React.FC<ActivarPromocionProps> = ({ promocion, onCloseModal }) => {
  const onConfirm = () => {
    promocion.borrado = 'NO';
    toast.promise(PromocionService.updatePromocionBorrado(promocion), {
      loading: 'Activando promoción...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800); return message;
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
      <h2>¿Seguro que quieres activar la promoción?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarPromocion;
