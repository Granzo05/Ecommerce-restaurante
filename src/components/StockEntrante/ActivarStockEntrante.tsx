import React from 'react';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';
import { StockEntrante } from '../../types/Stock/StockEntrante';

interface ActivarStockProps {
  stockEntrante: StockEntrante;
  onCloseModal: () => void;

}

const ActivarStockEntrante: React.FC<ActivarStockProps> = ({ stockEntrante, onCloseModal }) => {
  const onConfirm = () => {
    stockEntrante.borrado = 'NO';
    toast.promise(StockEntranteService.updateStock(stockEntrante), {
      loading: 'Activando stock entrante...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800); return message;
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
      <h2>¿Seguro que quieres activar el stock?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarStockEntrante;
