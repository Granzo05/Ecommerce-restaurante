import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';

interface EditarStockProps {
  stockEntrante: StockEntrante;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockEntrante }) => {

  const [fecha, setFecha] = useState(new Date());

  function editarStock() {
    if (!fecha) {
      toast.info("Por favor, coloque una fecha");
      return;
    }

    stockEntrante.fechaLlegada = fecha;

    StockEntranteService.updateStock(stockEntrante);

    clearInputs();
  }

  return (
    <div id="miModal" className="modal">
      <Toaster />
      <div className="modal-content">
        <div className="inputBox">
          <input type="date" required={true} value={fecha.toLocaleDateString()} onChange={(e) => { setFecha(new Date(e.target.value)) }} />
          <span>Fecha de entrada</span>
        </div>
        <button type="button" onClick={editarStock}>Editar stock entrante</button>
      </div>
    </div>
  )
}

export default EditarStock
