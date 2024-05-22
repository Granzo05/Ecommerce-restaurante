import React from 'react';
import { MenuService } from '../../services/MenuService';
import { toast, Toaster } from 'sonner';
import { ArticuloMenuDTO } from '../../types/Productos/ArticuloMenuDTO';

interface EliminarMenuProps {
  menuOriginal: ArticuloMenuDTO;
}

const EliminarMenu: React.FC<EliminarMenuProps> = ({ menuOriginal }) => {
  const onConfirm = () => {
    console.log(menuOriginal)
    toast.promise(MenuService.updateBorradoMenu(menuOriginal), {
      loading: 'Eliminando articulo...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  return (
      <div className="modal-info">
        <Toaster/>
        <p>¿Seguro que quieres eliminar el menú?</p>
        <button onClick={onConfirm}>Confirmar</button>
      </div>
  );
}

export default EliminarMenu;
