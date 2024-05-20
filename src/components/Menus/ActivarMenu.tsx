import React from 'react';
import { MenuService } from '../../services/MenuService';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { ArticuloMenuDTO } from '../../types/Productos/ArticuloMenuDTO';

interface ActivarMenuProps {
  menuOriginal: ArticuloMenuDTO;
}

const ActivarMenu: React.FC<ActivarMenuProps> = ({ menuOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(MenuService.updateBorradoMenu(menuOriginal), {
      loading: 'Activando articulo...',
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
      <Toaster />
      <p>¿Seguro que quieres activar el menú?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarMenu;
