import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/empleados.css';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { Sucursal } from '../../types/Restaurante/Sucursal';

interface ActivarSucursalProps {
  sucursal: Sucursal;
}

const ActivarSucursal: React.FC<ActivarSucursalProps> = ({ sucursal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(SucursalService.updateRestaurant(sucursal), {
      loading: 'Activando sucursal...',
      success: () => {
        return `Sucursal activada correctamente`;
      },
      error: 'Error',
    });
    navigate('/opciones');
  };

  const onCancel = () => {
    navigate('/opciones');
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
