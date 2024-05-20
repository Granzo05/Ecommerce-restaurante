import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';

interface ActivarArticuloProps {
  articuloOriginal: ArticuloVenta;
}

const ActivarArticuloVenta: React.FC<ActivarArticuloProps> = ({ articuloOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(ArticuloVentaService.updateBorradoArticulo(articuloOriginal), {
      loading: 'Activando articulo...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
    navigate('/opciones');
  };

  const onCancel = () => {
    navigate('/opciones');
  };

  return (
    <div>
      <Toaster />
      <p>¿Seguro que quieres activar el articulo?</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default ActivarArticuloVenta;
