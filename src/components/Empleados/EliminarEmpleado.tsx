import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmpleadoService } from '../../services/EmpleadoService';

interface EliminarMenuProps {
  empleadoId: number;
}

const EliminarMenu: React.FC<EliminarMenuProps> = ({ empleadoId }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    EmpleadoService.deleteEmpleado(empleadoId)
      .then(() => {
        navigate('/opciones');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onCancel = () => {
    navigate('/opciones');
  };

  return (
    <div id="miModal" className="modal">
      <div className="modal-content">
        <p>¿Seguro que quieres eliminar el empleado?</p>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarMenu;
