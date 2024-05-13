import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { StockArticuloVentaDTO } from '../../types/Stock/StockArticuloVentaDTO';
import { StockIngredientesDTO } from '../../types/Stock/StockIngredientesDTO';

interface EliminarStockProps {
  stockOriginal: StockArticuloVentaDTO | StockIngredientesDTO;
}

const EliminarStock: React.FC<EliminarStockProps> = ({ stockOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    if (stockOriginal instanceof StockIngredientesDTO) {
      StockIngredientesService.deleteStock(stockOriginal.id)
        .then(() => {
          navigate('/opciones');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (stockOriginal instanceof StockArticuloVentaDTO) {
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
