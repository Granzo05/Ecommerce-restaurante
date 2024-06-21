import React from 'react';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { toast, Toaster } from 'sonner';
import { StockIngredientes } from '../../types/Stock/StockIngredientes';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';

interface ActivarStockProps {
  stockOriginal: StockArticuloVenta | StockIngredientes;
  onCloseModal: () => void;
  tipo: string;
}

const ActivarStock: React.FC<ActivarStockProps> = ({ stockOriginal, onCloseModal, tipo }) => {

  const onConfirm = () => {
    if (tipo === 'ingrediente') {
      stockOriginal.borrado = 'NO';
      toast.promise(StockIngredientesService.updateStock(stockOriginal), {
        loading: 'Activando stock del ingrediente...',
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
      stockOriginal.borrado = 'NO';
      toast.promise(StockArticuloVentaService.updateStock(stockOriginal), {
        loading: 'Activando stock del articulo...',
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
      <h2>¿Seguro que quieres activar el stock?</h2>
        <button onClick={onConfirm}>Confirmar</button>
        <br />
        <button onClick={onCancel}>Cancelar</button>

    </div>
  );
}

export default ActivarStock;
