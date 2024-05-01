import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { StockIngredientes } from '../../types/Stock/StockIngredientes';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';

interface EliminarStockProps {
  stockOriginal: StockArticuloVenta | StockIngredientes;
}

const EliminarStock: React.FC<EliminarStockProps> = ({ stockOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    if (stockOriginal instanceof StockIngredientes) {
      StockIngredientesService.deleteStock(stockOriginal.id)
        .then(() => {
          navigate('/opciones');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (stockOriginal instanceof StockArticuloVenta) {
      StockArticuloVentaService.deleteStock(stockOriginal.id)
        .then(() => {
          navigate('/opciones');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      console.error('Tipo de stock no reconocido');
    }
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
