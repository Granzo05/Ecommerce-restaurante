import React from 'react';
import { MenuService } from '../../services/MenuService';
import { toast, Toaster } from 'sonner';
import { ArticuloMenuDTO } from '../../types/Productos/ArticuloMenuDTO';

interface ActivarMenuProps {
  menuOriginal: ArticuloMenuDTO;
  onCloseModal: () => void;
}

const ActivarMenu: React.FC<ActivarMenuProps> = ({ menuOriginal, onCloseModal }) => {
  const onConfirm = () => {
    toast.promise(MenuService.updateBorradoMenu(menuOriginal), {
      loading: 'Activando articulo...',
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
