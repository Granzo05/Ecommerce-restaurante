import React from 'react';
import { Medida } from '../../types/Ingredientes/Medida';
import { MedidaService } from '../../services/MedidaService';
import { Toaster, toast } from 'sonner'

interface EliminarMedidaProps {
  medidaOriginal: Medida;
  onCloseModal: () => void;
}

const EliminarMedida: React.FC<EliminarMedidaProps> = ({ medidaOriginal, onCloseModal }) => {

  const onConfirm = () => {
    medidaOriginal.borrado = 'SI';
    toast.promise(MedidaService.updateMedida(medidaOriginal), {
      loading: 'Eliminando Medida...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return 'Medida eliminada correctamente';
      },
      error: (message) => {
        return 'No se puedo eliminar la medida';
      },
    });
  };

  const onCancel = () => {
    onCloseModal();
  };

  return (
    <div className="modal-info">

      <h2>¿Seguro que quieres eliminar la medida?</h2>
      <Toaster />
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarMedida;
