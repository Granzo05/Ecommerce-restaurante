import React from 'react';
import { MenuService } from '../../services/MenuService';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

interface EliminarMenuProps {
  menuNombre: string;
}

const EliminarMenu: React.FC<EliminarMenuProps> = ({ menuNombre }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(MenuService.deleteMenu(menuNombre), {
      loading: 'Eliminando articulo...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  const onCancel = () => {
    navigate('/opciones');
  };

  return (
      <div className="modal-info">
        <Toaster/>
        <p>¿Seguro que quieres eliminar el menú?</p>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
  );
}

export default EliminarMenu;
