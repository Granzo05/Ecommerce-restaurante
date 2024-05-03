import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/empleados.css';
import { SucursalService } from '../../services/SucursalService';

interface EliminarSucursalProps {
  idSucursal: number;
}

const EliminarMenu: React.FC<EliminarSucursalProps> = ({ idSucursal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    SucursalService.deleteSucursal(idSucursal)
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
    <p>¿Seguro que quieres eliminar la sucursal?</p>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  </div>
  );
}

export default EliminarMenu;
