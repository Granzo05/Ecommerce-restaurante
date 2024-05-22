import React from 'react';
import '../../styles/empleados.css';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { Sucursal } from '../../types/Restaurante/Sucursal';

interface ActivarSucursalProps {
  sucursal: Sucursal;
  onCloseModal: () => void;

}

const ActivarSucursal: React.FC<ActivarSucursalProps> = ({ sucursal, onCloseModal }) => {
  const onConfirm = () => {
    toast.promise(SucursalService.updateRestaurant(sucursal), {
      loading: 'Activando sucursal...',
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
      <p>¿Seguro que quieres activar la sucursal?</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default ActivarSucursal;
