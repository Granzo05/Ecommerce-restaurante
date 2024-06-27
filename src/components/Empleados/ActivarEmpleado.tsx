import React from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { Empleado } from '../../types/Restaurante/Empleado';

interface ActivarEmpleadoProps {
  empleadoOriginal: Empleado;
  onCloseModal: () => void;
}

const ActivarEmpleado: React.FC<ActivarEmpleadoProps> = ({ empleadoOriginal, onCloseModal }) => {

  const onConfirm = () => {
    empleadoOriginal.borrado = 'NO';
    toast.promise(EmpleadoService.updateBorrado(empleadoOriginal), {
      loading: 'Activando empleado...',
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
      <h2>¿Seguro que quieres activar el empleado?</h2>
        <button onClick={onConfirm}>Confirmar</button>
        <br />
        <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarEmpleado;
