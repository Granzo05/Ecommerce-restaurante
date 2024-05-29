import React from 'react';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { toast, Toaster } from 'sonner';
import '../../styles/modalFlotante.css'
import { StockIngredientes } from '../../types/Stock/StockIngredientes';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';

interface EliminarStockProps {
  stockOriginal: StockArticuloVenta | StockIngredientes;
  onCloseModal: () => void;
  tipo: string;
}



const EliminarStock: React.FC<EliminarStockProps> = ({ stockOriginal, onCloseModal, tipo }) => {
  const onConfirm = () => {
    if (tipo === 'ingrediente') {
      stockOriginal.borrado = 'SI';
      toast.promise(StockIngredientesService.updateStock(stockOriginal), {
        loading: 'Eliminando stock del ingrediente...',
        success: (message) => {
          setTimeout(() => {
            onCloseModal();
          }, 800);
          return message;
        },
        error: (message) => {
          return message;
        },
      });
    } else {
      stockOriginal.borrado = 'SI';
      toast.promise(StockArticuloVentaService.updateStock(stockOriginal), {
        loading: 'Eliminando stock del articulo...',
        success: (message) => {
          setTimeout(() => {
            onCloseModal();
          }, 800);
          return message;
        },
        error: (message) => {
          return message;
        },
      });
    }
  };

  const onCancel = () => {
    onCloseModal();
  };

  return (
    <div className="modal-info">
      <Toaster />
      <h2>¿Seguro que quieres eliminar el stock?</h2>
      <div className="btns-eliminar-stock">
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>

    </div>
  );
}

export default EliminarStock;
