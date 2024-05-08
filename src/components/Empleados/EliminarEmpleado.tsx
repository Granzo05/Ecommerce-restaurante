import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmpleadoService } from '../../services/EmpleadoService';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'

interface EliminarEmpleadoProps {
  cuilEmpleado: string;
}

const EliminarEmpleado: React.FC<EliminarEmpleadoProps> = ({ cuilEmpleado }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(EmpleadoService.deleteEmpleado(cuilEmpleado), {
      loading: 'Eliminando empleado...',
      success: () => {
        navigate('/opciones');
        return `Empleado eliminado correctamente`;
      },
      error: 'Error',
    });
  };

  const onCancel = () => {
    navigate('/opciones');
  };

  return (
    <div>
      <Toaster />
      <p>¿Seguro que quieres eliminar el empleado?</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarEmpleado;
