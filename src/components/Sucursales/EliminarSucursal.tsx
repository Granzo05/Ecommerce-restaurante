import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/empleados.css';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'

interface EliminarSucursalProps {
  idSucursal: number;
}

const EliminarMenu: React.FC<EliminarSucursalProps> = ({ idSucursal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(SucursalService.deleteSucursal(idSucursal), {
      loading: 'Eliminando sucursal...',
      success: () => {
        return `Sucursal eliminada correctamente`;
      },
      error: 'Error',
    });
    navigate('/opciones');

  };

  const onCancel = () => {
    navigate('/opciones');
  };

  return (
    <div>
      <Toaster />
      <p>¿Seguro que quieres eliminar la sucursal?</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarMenu;
