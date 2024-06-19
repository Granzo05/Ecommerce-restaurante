import React from 'react';
import { Toaster, toast } from 'sonner'
import { Privilegios } from '../../types/Restaurante/Privilegios';
import { PrivilegiosService } from '../../services/PrivilegiosService';

interface EliminarMedidaProps {
  privilegioOriginal: Privilegios;
  onCloseModal: () => void;
}

const EliminarPrivilegio: React.FC<EliminarMedidaProps> = ({ privilegioOriginal, onCloseModal }) => {

  const onConfirm = () => {
    privilegioOriginal.borrado = 'SI';
    toast.promise(PrivilegiosService.updatePrivilegios(privilegioOriginal), {
      loading: 'Eliminando rol...',
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

      <h2>¿Seguro que quieres eliminar el privilegio?</h2>
      <Toaster />
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarPrivilegio;
