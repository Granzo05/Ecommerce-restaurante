import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmpleadoService } from '../../services/EmpleadoService';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { Empleado } from '../../types/Restaurante/Empleado';

interface ActivarEmpleadoProps {
  empleadoOriginal: Empleado;
}

const ActivarEmpleado: React.FC<ActivarEmpleadoProps> = ({ empleadoOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(EmpleadoService.updateEmpleado(empleadoOriginal), {
      loading: 'Activando empleado...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  const onCancel = () => {
    navigate('/opciones');
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
