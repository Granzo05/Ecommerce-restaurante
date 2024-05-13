import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';

interface EliminarArticuloProps {
  articuloId: number;
}

const EliminarArticuloVenta: React.FC<EliminarArticuloProps> = ({ articuloId }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    ArticuloVentaService.deleteArticulo(articuloId)
      .then(() => {
        navigate('/opciones');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onCancel = () => {
    navigate('/opciones');
  };

  return (
    <div className="modal-info">
      <p>¿Seguro que quieres eliminar el articulo?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarArticuloVenta;
