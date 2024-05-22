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
    toast.promise(EmpleadoService.updateEmpleado(empleadoOriginal), {
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
    <div>
      <Toaster />
      <p>¿Seguro que quieres activar el empleado?</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default ActivarEmpleado;
