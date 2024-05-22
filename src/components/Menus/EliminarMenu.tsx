import React from 'react';
import { MenuService } from '../../services/MenuService';
import { toast, Toaster } from 'sonner';
import { ArticuloMenuDTO } from '../../types/Productos/ArticuloMenuDTO';

interface EliminarMenuProps {
  menuOriginal: ArticuloMenuDTO;
  onCloseModal: () => void;
}

const EliminarMenu: React.FC<EliminarMenuProps> = ({ menuOriginal, onCloseModal }) => {
  const onConfirm = () => {
    toast.promise(MenuService.updateBorradoMenu(menuOriginal), {
      loading: 'Eliminando articulo...',
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
      <p>¿Seguro que quieres eliminar el menú?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarMenu;
