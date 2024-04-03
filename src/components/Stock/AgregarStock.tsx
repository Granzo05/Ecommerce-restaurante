import { useState } from 'react';
import { Stock } from '../../types/Stock';
import { StockService } from '../../services/StockService';
import { Ingrediente } from '../../types/Ingrediente';

function AgregarStock() {

  const [cantidad, setCantidad] = useState(0);
  const [medida, setMedida] = useState('');
  const [nombreIngrediente, setIngredienteNombre] = useState('');
  const [costoIngrediente, setCostoIngrediente] = useState(0);

  function agregarStock() {
    const stock: Stock = new Stock();

    const ingrediente: Ingrediente = new Ingrediente();
    ingrediente.nombre = nombreIngrediente;
    ingrediente.costo = costoIngrediente;

    stock.ingrediente = ingrediente;
    stock.cantidad = cantidad;
    stock.medida = medida;

    StockService.createStock(stock);
  }

  return (
    <div className="modal-info">
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Nombre del ingrediente" id="nombreStock" onChange={(e) => { setIngredienteNombre(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cantidad del ingrediente" id="cantidadStock" onChange={(e) => { setCantidad(parseFloat(e.target.value)) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Medida del ingrediente" id="medidaStock" onChange={(e) => { setMedida(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Costo del ingrediente" id="costoStock" onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
      </label>
      <input type="button" value="agregarStock" id="agregarStock" onClick={agregarStock} />
    </div>
  )
}

export default AgregarStock
