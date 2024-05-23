import React from 'react';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { StockArticuloVentaDTO } from '../../types/Stock/StockArticuloVentaDTO';
import { StockIngredientesDTO } from '../../types/Stock/StockIngredientesDTO';
import { toast, Toaster } from 'sonner';

interface ActivarStockProps {
  stockOriginal: StockArticuloVentaDTO | StockIngredientesDTO;
  onCloseModal: () => void;

}

const ActivarStock: React.FC<ActivarStockProps> = ({ stockOriginal, onCloseModal }) => {

  const onConfirm = () => {
    if (stockOriginal.tipo === 'ingrediente') {
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
      <h3>¿Seguro que quieres activar el stock?</h3>
      <div className="btns-eliminar-stock">
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>

    </div>
  );
}

export default ActivarStock;
