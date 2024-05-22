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

  const onCancel = () => {
    onCloseModal();
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

export default EliminarSucursal;
