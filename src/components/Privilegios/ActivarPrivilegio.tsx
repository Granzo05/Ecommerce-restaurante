import React from 'react';
import { Toaster, toast } from 'sonner'
import { PrivilegiosService } from '../../services/PrivilegiosService';
import { Privilegios } from '../../types/Restaurante/Privilegios';

interface ActivarMedidaProps {
  privilegioOriginal: Privilegios;
  onCloseModal: () => void;
}

const ActivarMedida: React.FC<ActivarMedidaProps> = ({ privilegioOriginal, onCloseModal }) => {
  const onConfirm = () => {
    privilegioOriginal.borrado = 'NO';
    toast.promise(PrivilegiosService.updatePrivilegios(privilegioOriginal), {
      loading: 'Activando Medida...',
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
      <h2>¿Seguro que quieres activar el privilegio?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarMedida;
