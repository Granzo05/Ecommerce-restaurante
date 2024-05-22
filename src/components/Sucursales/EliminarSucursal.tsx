import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/empleados.css';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { Sucursal } from '../../types/Restaurante/Sucursal';

interface EliminarSucursalProps {
  sucursal: Sucursal;
}

const EliminarSucursal: React.FC<EliminarSucursalProps> = ({ sucursal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(SucursalService.updateRestaurant(sucursal), {
      loading: 'Eliminando sucursal...',
      success: () => {
        return `Sucursal eliminada correctamente`;
      },
      error: 'Error',
    });
    navigate('/opciones');
  };


  return (
    <div className='modal-info'>
      <h2>¿Seguro que quieres eliminar la sucursal?</h2>
      <Toaster />
        <button onClick={onConfirm}>Confirmar</button>
    </div>
  );
}

export default EliminarSucursal;
