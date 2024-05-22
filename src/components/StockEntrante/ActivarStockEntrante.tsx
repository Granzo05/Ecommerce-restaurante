import React from 'react';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';

interface ActivarStockProps {
  stockEntrante: StockEntrante;
  onCloseModal: () => void;

}

const ActivarStockEntrante: React.FC<ActivarStockProps> = ({ stockEntrante, onCloseModal }) => {
  const onConfirm = () => {
    toast.promise(StockEntranteService.updateStock(stockEntrante), {
      loading: 'Activando stock entrante...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);        return message;
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
      <p>¿Seguro que quieres activar el stock?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarStockEntrante;
