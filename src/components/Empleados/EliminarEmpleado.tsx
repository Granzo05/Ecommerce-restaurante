import React from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { Empleado } from '../../types/Restaurante/Empleado';

interface EliminarEmpleadoProps {
  empleadoOriginal: Empleado;
  onCloseModal: () => void;
}

const EliminarEmpleado: React.FC<EliminarEmpleadoProps> = ({ empleadoOriginal, onCloseModal }) => {

  const onConfirm = () => {
    empleadoOriginal.borrado = 'SI';
    toast.promise(EmpleadoService.updateEmpleado(empleadoOriginal), {
      loading: 'Eliminando empleado...',
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
      <h2>¿Seguro que quieres eliminar el empleado?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarEmpleado;
