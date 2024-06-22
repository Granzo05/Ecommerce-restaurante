import React from 'react';
import { MedidaService } from '../../services/MedidaService';
import { Toaster, toast } from 'sonner'
import { Medida } from '../../types/Ingredientes/Medida';

interface ActivarMedidaProps {
  medidaOriginal: Medida;
  onCloseModal: () => void;
}

const ActivarMedida: React.FC<ActivarMedidaProps> = ({ medidaOriginal, onCloseModal }) => {
  const onConfirm = () => {
    medidaOriginal.borrado = 'NO';
    toast.promise(MedidaService.updateMedida(medidaOriginal), {
      loading: 'Activando Medida...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return 'Medida activada correctamente';
      },
      error: (message) => {
        return 'No se pudo activar la medida';
      },
    });
  };

  const onCancel = () => {
    onCloseModal();
  };

  return (
    <div className="modal-info">
      <Toaster />
      <h2>¿Seguro que quieres activar la medida?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarMedida;
