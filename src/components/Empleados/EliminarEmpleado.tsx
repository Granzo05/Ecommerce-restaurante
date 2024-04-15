import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmpleadoService } from '../../services/EmpleadoService';
import '../../styles/empleados.css';

interface EliminarMenuProps {
  cuitEmpleado: number;
}

const EliminarMenu: React.FC<EliminarMenuProps> = ({ cuitEmpleado }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    EmpleadoService.deleteEmpleado(cuitEmpleado)
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

  return (<div>
    <p>¿Seguro que quieres eliminar el empleado?</p>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  </div>
  );
}

export default EliminarMenu;
