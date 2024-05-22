import React from 'react';
import '../../styles/empleados.css';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { Sucursal } from '../../types/Restaurante/Sucursal';

interface EliminarSucursalProps {
  sucursal: Sucursal;
  onCloseModal: () => void;
}

const EliminarSucursal: React.FC<EliminarSucursalProps> = ({ sucursal, onCloseModal }) => {

  const onConfirm = () => {
    toast.promise(SucursalService.updateRestaurant(sucursal), {
      loading: 'Eliminando sucursal...',
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

  return (
    <div className='modal-info'>
      <h2>¿Seguro que quieres eliminar la sucursal?</h2>
      <Toaster />
        <button onClick={onConfirm}>Confirmar</button>
    </div>
  );
}

export default EliminarSucursal;
