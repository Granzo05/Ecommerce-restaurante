import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';

interface ActivarStockProps {
  stockEntrante: StockEntrante;
}

const ActivarStockEntrante: React.FC<ActivarStockProps> = ({ stockEntrante }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(StockEntranteService.updateStock(stockEntrante), {
      loading: 'Activando stock entrante...',
      success: (message) => {
        navigate('/opciones');
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  const onCancel = () => {
    navigate('/opciones');
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
