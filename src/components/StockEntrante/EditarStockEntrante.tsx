import { useState } from 'react';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';
import { StockEntrante } from '../../types/Stock/StockEntrante';

interface EditarStockProps {
  stockEntrante: StockEntrante;
  onCloseModal: () => void;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockEntrante, onCloseModal }) => {
  const formatDate = (date: Date) => {
    const dia = date.getDate() + 1;
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();
    return new Date(año, mes - 1, dia);
  };

  const [fecha, setFecha] = useState(stockEntrante.fechaLlegada ? new Date(stockEntrante.fechaLlegada) : new Date());
  
  function editarStock() {
    const hoy = new Date();
    const fechaIngresada = new Date(fecha);

    if (!fecha) {
      toast.error("Por favor, la fecha es necesaria");
      return;
    } else if (fechaIngresada <= hoy) {
      toast.error("Por favor, la fecha es necesaria y debe ser posterior a la fecha actual");
      return;
    } else if (fecha < fechaIngresada){
      toast.error("Por favor, la fecha es necesaria y debe ser posterior a la fecha actual");
      return;
    }
    stockEntrante.borrado = 'NO';

    stockEntrante.fechaLlegada = formatDate(new Date(fecha));
    toast.promise(StockEntranteService.updateStock(stockEntrante), {
      loading: 'Editando stock entrante...',
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

  return (
    <div className="modal-info">
      <h2>&mdash; Editar stock entrante &mdash;</h2>
      <Toaster />
      <div className="inputBox">
      <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de entrada:</label>
              
        <input
          type="date"
          required={true}
          value={fecha.toISOString().substring(0, 10)}
          onChange={(e) => setFecha(new Date(e.target.value))}
        />        
      </div>
      <button type="button" onClick={editarStock}>Editar stock entrante</button>
    </div>
  )
}

export default EditarStock