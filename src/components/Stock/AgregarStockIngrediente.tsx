import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';

function AgregarStockIngrediente() {

  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [medida, setMedida] = useState('');
  const [costoIngrediente, setCostoIngrediente] = useState(0);
  const [nombreArticuloVenta, setArticuloVenta] = useState('');

  async function agregarStock() {
    const stock: StockArticuloVenta = new StockArticuloVenta();

    let medidaEnum: EnumMedida | undefined = undefined;
    if (Object.values(EnumMedida).includes(medida as EnumMedida)) {
      medidaEnum = EnumMedida[medida as keyof typeof EnumMedida];
      stock.medida = medidaEnum;
    }

    stock.cantidadActual = cantidadActual;
    stock.cantidadMinima = cantidadMinima;
    stock.cantidadMaxima = cantidadMaxima;
    stock.precioCompra = costoIngrediente;

    const articuloVenta: ArticuloVenta = new ArticuloVenta();
    
    articuloVenta.nombre = nombreArticuloVenta;
    stock.articuloVenta = articuloVenta;

    StockArticuloVentaService.createStock(stock);
    clearInputs();
  }

  return (
    <div className="modal-info">
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Nombre del artículo" onChange={(e) => { setArticuloVenta(e.target.value) }} />
      </label>
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cantidad mínima del ingrediente" onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
      </label>
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cantidad máxima del ingrediente" onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
      </label>
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cantidad actual del ingrediente" onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <select id="medidaStock" onChange={(e) => { setMedida(e.target.value) }}>
          <option value="">Seleccionar medida ingrediente</option>
          <option value="Kilogramos">Kilogramos</option>
          <option value="Gramos">Gramos</option>
          <option value="Litros">Litros</option>
          <option value="Centimetros cubicos">Centimetros cúbicos</option>
          <option value="Unidades">Unidades</option>
        </select>
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Costo del ingrediente por una unidad de medida" id="costoStock" onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
      </label>
      <input type="button" value="agregarStock" id="agregarStock" onClick={agregarStock} />
    </div>
  )
}

export default AgregarStockIngrediente
