import { useState } from 'react';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';
import { StockEntrante } from '../../types/Stock/StockEntrante';

interface EditarStockProps {
  stockEntrante: StockEntrante;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockEntrante }) => {
  const formatDate = (date: Date) => {
    const dia = date.getDate() + 1;
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();
    return new Date(año, mes - 1, dia);
  };

  const [fecha, setFecha] = useState(stockEntrante.fechaLlegada ? new Date(stockEntrante.fechaLlegada) : new Date());
  
  function editarStock() {
    if (!fecha) {
      toast.info("Por favor, coloque una fecha");
      return;
    }
    stockEntrante.borrado = 'NO';

    stockEntrante.fechaLlegada = formatDate(new Date(fecha));
    toast.promise(StockEntranteService.updateStock(stockEntrante), {
      loading: 'Editando stock entrante...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <Toaster />
      <div className="inputBox">
        <input
          type="date"
          required={true}
          value={fecha.toISOString().substring(0, 10)}
          onChange={(e) => setFecha(new Date(e.target.value))}
        />        
        <span>Fecha de entrada</span>
      </div>
      <button type="button" onClick={editarStock}>Editar stock entrante</button>
    </div>
  )
}

export default EditarStock