import React from 'react';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';
import { StockEntranteDTO } from '../../types/Stock/StockEntranteDTO';

interface EliminarStockProps {
  stockEntrante: StockEntranteDTO;
  onCloseModal: () => void;

}

const EliminarStockEntrante: React.FC<EliminarStockProps> = ({ stockEntrante, onCloseModal }) => {
  const onConfirm = () => {
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
      <p>¿Seguro que quieres eliminar el stock?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarStockEntrante;
