import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';

interface EliminarStockProps {
  stockEntrante: StockEntrante;
}

const EliminarStock: React.FC<EliminarStockProps> = ({ stockEntrante }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    StockEntranteService.deleteStock(stockEntrante.id)
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
      <p>¿Seguro que quieres eliminar el stock?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarStock;
