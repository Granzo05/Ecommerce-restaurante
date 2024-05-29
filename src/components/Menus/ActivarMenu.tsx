import React from 'react';
import { MenuService } from '../../services/MenuService';
import { toast, Toaster } from 'sonner';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';

interface ActivarMenuProps {
  menuOriginal: ArticuloMenu;
  onCloseModal: () => void;
}

const ActivarMenu: React.FC<ActivarMenuProps> = ({ menuOriginal, onCloseModal }) => {
  const onConfirm = () => {
    menuOriginal.borrado = 'NO';
    toast.promise(MenuService.updateBorradoMenu(menuOriginal), {
      loading: 'Activando menú...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 1000);
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
      <h2>¿Seguro que quieres activar el menú?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarMenu;
