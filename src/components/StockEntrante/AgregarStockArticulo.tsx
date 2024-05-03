import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';

function AgregarStockEntrante() {

  const [fecha, setFecha] = useState(new Date());

  async function agregarStockEntrante() {
    const stockEntrante: StockEntrante = new StockEntrante();

    stockEntrante.fechaLlegada = fecha;

    StockEntranteService.createStock(stockEntrante);

    clearInputs();
  }

  return (
    <div className="modal-info">
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="date" placeholder="Fecha" onChange={(e) => { setFecha(new Date(e.target.value)) }} />
      </label>
      <br />
      <input type="button" value="agregarStock" id="agregarStock" onClick={agregarStockEntrante} />
    </div>
  )
}

export default AgregarStockEntrante
