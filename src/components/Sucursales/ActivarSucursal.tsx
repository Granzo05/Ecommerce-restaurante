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
    sucursal.borrado = 'NO';
    toast.promise(SucursalService.updateBorrado(sucursal), {
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
    <div className='modal-info'>
      <Toaster />
      <h2>¿Seguro que quieres activar la sucursal?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarSucursal;
