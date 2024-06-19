import React from 'react';
import { Toaster, toast } from 'sonner'
import { Roles } from '../../types/Restaurante/Roles';
import { RolesService } from '../../services/RolesService';

interface ActivarMedidaProps {
  rolOriginal: Roles;
  onCloseModal: () => void;
}

const ActivarMedida: React.FC<ActivarMedidaProps> = ({ rolOriginal, onCloseModal }) => {
  const onConfirm = () => {
    rolOriginal.borrado = 'NO';
    toast.promise(RolesService.updateRol(rolOriginal), {
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
      <h2>¿Seguro que quieres activar el rol?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarMedida;
