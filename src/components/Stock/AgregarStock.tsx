import { useState } from 'react';
import { Stock } from '../../types/Stock';
import { StockService } from '../../services/StockService';
import { Ingrediente } from '../../types/Ingrediente';
import { clearInputs } from '../../utils/global_variables/clearInputs';

function AgregarStock() {

  const [cantidad, setCantidad] = useState(0);
  const [medida, setMedida] = useState('');
  const [nombreIngrediente, setIngredienteNombre] = useState('');
  const [costoIngrediente, setCostoIngrediente] = useState(0);
  const [fechaReposicion, setFechaReposicion] = useState(new Date());

  async function agregarStock() {
    const stock: Stock = new Stock();

    const ingrediente: Ingrediente = new Ingrediente();
    ingrediente.nombre = nombreIngrediente;
    ingrediente.costo = costoIngrediente;
    ingrediente.medida = medida;

    stock.cantidad = cantidad;
    stock.fechaIngreso = new Date(fechaReposicion.getFullYear(), fechaReposicion.getMonth(), fechaReposicion.getDate() + 1);
    stock.ingrediente = ingrediente;

    let response = await StockService.createStock(stock);
    alert(response);

    clearInputs();
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
        <input type="text" placeholder="Cantidad stock del ingrediente" id="cantidadStock" onChange={(e) => { setCantidad(parseFloat(e.target.value)) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <select id="medidaStock" onChange={(e) => { setMedida(e.target.value) }}>
          <option value="Kg">Kilogramos</option>
          <option value="Gramos">Gramos</option>
          <option value="Litros">Litros</option>
          <option value="Unidades">Unidades</option>
        </select>
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Costo del ingrediente por una unidad de medida" id="costoStock" onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
      </label>
      <label>
        <i className='bx bx-lock'></i>
        <label htmlFor="fechaReposicion">Fecha de próximo stock</label>
        <input type="date" id="fechaReposicion" onChange={(e) => { setFechaReposicion(new Date(e.target.value)) }} />
      </label>
      <input type="button" value="agregarStock" id="agregarStock" onClick={agregarStock} />
    </div>
  )
}

export default AgregarStock
