import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';

interface EditarStockProps {
  stockEntrante: StockEntrante;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockEntrante }) => {

  const [fecha, setFecha] = useState(new Date());

  function editarStock() {
    stockEntrante.fechaLlegada = fecha;

    StockEntranteService.updateStock(stockEntrante);

    clearInputs();
  }

  return (
    <div id="miModal" className="modal">
      <div className="modal-content">
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <input type="date" placeholder="Fecha" onChange={(e) => { setFecha(new Date(e.target.value)) }} />
        </label>
        <input type="button" value="editarStock" id="editarStock" onClick={editarStock} />
      </div>
    </div>
  )
}

export default EditarStock
