import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { StockArticuloVentaDTO } from '../../types/Stock/StockArticuloVentaDTO';
import { StockIngredientesDTO } from '../../types/Stock/StockIngredientesDTO';
import { toast, Toaster } from 'sonner';

interface EliminarStockProps {
  stockOriginal: StockArticuloVentaDTO | StockIngredientesDTO;
}

const EliminarStock: React.FC<EliminarStockProps> = ({ stockOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    if (stockOriginal.tipo === 'ingrediente') {
      toast.promise(StockIngredientesService.deleteStock(stockOriginal.id), {
        loading: 'Eliminando stock del ingrediente...',
        success: (message) => {
          navigate('/opciones');
          return message;
        },
        error: (message) => {
          return message;
        },
      });
    } else {
      toast.promise(StockArticuloVentaService.deleteStock(stockOriginal.id), {
        loading: 'Eliminando stock del articulo...',
        success: (message) => {
          navigate('/opciones');
          return message;
        },
        error: (message) => {
          return message;
        },
      });
    }
  };

  const onCancel = () => {
    navigate('/opciones');
  };

  return (
    <div className="modal-info">
      <Toaster />
      <p>¿Seguro que quieres eliminar el stock?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarStock;
