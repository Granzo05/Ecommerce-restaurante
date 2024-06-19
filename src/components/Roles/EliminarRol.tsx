import React from 'react';
import { Toaster, toast } from 'sonner'
import { Roles } from '../../types/Restaurante/Roles';
import { RolesService } from '../../services/RolesService';

interface EliminarMedidaProps {
  rolOriginal: Roles;
  onCloseModal: () => void;
}

const EliminarRol: React.FC<EliminarMedidaProps> = ({ rolOriginal, onCloseModal }) => {

  const onConfirm = () => {
    rolOriginal.borrado = 'SI';
    toast.promise(RolesService.updateRol(rolOriginal), {
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

      <h2>¿Seguro que quieres eliminar el rol?</h2>
      <Toaster />
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarRol;
