import React from 'react';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';
import { StockEntrante } from '../../types/Stock/StockEntrante';

interface EliminarStockProps {
  stockEntrante: StockEntrante;
  onCloseModal: () => void;

}

const EliminarStockEntrante: React.FC<EliminarStockProps> = ({ stockEntrante, onCloseModal }) => {
  const onConfirm = () => {
    stockEntrante.borrado = 'SI';
    toast.promise(StockEntranteService.updateStock(stockEntrante), {
      loading: 'Eliminando stock entrante...',
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
  };

  const onCancel = () => {
    onCloseModal();
  };
  return (
    <div className="modal-info">
      <Toaster />
      <h2>¿Seguro que quieres eliminar el stock?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarStockEntrante;
