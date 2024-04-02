import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockService } from '../../services/StockService';

interface EliminarStockProps {
  stockId: number;
}

const EliminarStock: React.FC<EliminarStockProps> = ({ stockId }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    StockService.deleteStock(stockId)
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
    <div id="miModal" className="modal">
      <div className="modal-content">
        <p>¿Seguro que quieres eliminar el stock?</p>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarStock;
