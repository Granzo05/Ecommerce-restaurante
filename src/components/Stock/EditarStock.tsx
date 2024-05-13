import { useState } from 'react';
import { StockIngredientes } from '../../types/Stock/StockIngredientes';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { clearInputs } from '../../utils/global_variables/functions';
import { StockArticuloVentaDTO } from '../../types/Stock/StockArticuloVentaDTO';
import { StockIngredientesDTO } from '../../types/Stock/StockIngredientesDTO';

interface EditarStockProps {
  stockOriginal: StockArticuloVentaDTO | StockIngredientesDTO;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockOriginal }) => {

  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [medida, setMedida] = useState('');
  const [costoIngrediente, setCostoIngrediente] = useState(0);

  function editarStock() {
    if (stockOriginal instanceof StockIngredientesDTO) {
      const stock: StockIngredientesDTO = stockOriginal;

      let medidaEnum: EnumMedida | undefined = undefined;
      if (Object.values(EnumMedida).includes(medida as EnumMedida)) {
        medidaEnum = EnumMedida[medida as keyof typeof EnumMedida];
        stock.medida = medidaEnum;
      }

      stock.cantidadActual = cantidadActual;
      stock.cantidadMinima = cantidadMinima;
      stock.cantidadMaxima = cantidadMaxima;
      stock.precioCompra = costoIngrediente;
      StockIngredientesService.updateStock(stock);

    } else if (stockOriginal instanceof StockArticuloVentaDTO) {
      const stock: StockArticuloVentaDTO = stockOriginal;

      let medidaEnum: EnumMedida | undefined = undefined;
      if (Object.values(EnumMedida).includes(medida as EnumMedida)) {
        medidaEnum = EnumMedida[medida as keyof typeof EnumMedida];
        stock.medida = medidaEnum;
      }

      stock.cantidadActual = cantidadActual;
      stock.cantidadMinima = cantidadMinima;
      stock.cantidadMaxima = cantidadMaxima;
      stock.precioCompra = costoIngrediente;
      StockArticuloVentaService.updateStock(stock);
    } else {
      console.error('Tipo de stock no reconocido');
    }

    clearInputs();
  }

  return (
    <div id="miModal" className="modal">
      <div className="modal-content">
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" value={stockOriginal.cantidadMinima} placeholder="Cantidad mínima del ingrediente" onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
        </label>
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" value={stockOriginal.cantidadMaxima} placeholder="Cantidad máxima del ingrediente" onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
        </label>
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" value={stockOriginal.cantidadActual} placeholder="Cantidad actual del ingrediente" onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
        </label>
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <select id="medidaStock" onChange={(e) => { setMedida(e.target.value) }}>
            <option value="Kg">Kilogramos</option>
            <option value="Gramos">Gramos</option>
            <option value="Litros">Litros</option>
            <option value="Unidades">Unidades</option>
            <option value="Docenas">Docenas</option>
          </select>
        </label>
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" placeholder="Costo del ingrediente" id="costoStock" onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
        </label>
        <input type="button" value="editarStock" id="editarStock" onClick={editarStock} />
      </div>
    </div>
  )
}

export default EditarStock
