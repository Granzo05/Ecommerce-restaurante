import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { Toaster, toast } from 'sonner'

interface EliminarArticuloProps {
  articuloId: number;
}

const EliminarArticuloVenta: React.FC<EliminarArticuloProps> = ({ articuloId }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(ArticuloVentaService.deleteArticulo(articuloId), {
      loading: 'Eliminando articulo...',
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
    <div className="modal-info">
      <Toaster />
      <p>¿Seguro que quieres eliminar el articulo?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarArticuloVenta;
