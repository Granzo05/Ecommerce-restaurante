import React from 'react';
import { MenuService } from '../../services/MenuService';
import { useNavigate } from 'react-router-dom';

interface EliminarMenuProps {
  menuId: number;
}

const EliminarMenu: React.FC<EliminarMenuProps> = ({ menuId }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    MenuService.deleteMenu(menuId)
      .then(() => {
        navigate('/menus');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onCancel = () => {
    navigate('/menus');
  };

  return (
    <div id="miModal" className="modal">
      <div className="modal-content">
        <p>¿Seguro que quieres eliminar el menú?</p>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarMenu;
