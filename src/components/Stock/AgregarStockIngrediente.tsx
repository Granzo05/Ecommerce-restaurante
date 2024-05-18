import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { Toaster, toast } from 'sonner'
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockIngredientes } from '../../types/Stock/StockIngredientes';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';

function AgregarStockIngrediente() {

  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [medida, setMedida] = useState<EnumMedida | string>('');
  const [costoIngrediente, setCostoIngrediente] = useState(0);
  const [nombreIngrediente, setArticuloVenta] = useState('0');

  async function crearStockIngrediente() {
    if (!nombreIngrediente || !cantidadActual || !cantidadMinima || !costoIngrediente || !cantidadMaxima || !medida) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    const stock: StockIngredientes = new StockIngredientes();
    stock.cantidadActual = cantidadActual;
    stock.cantidadMinima = cantidadMinima;
    stock.cantidadMaxima = cantidadMaxima;
    stock.precioCompra = costoIngrediente;

    if (medida) stock.medida = medida;

    const ingrediente: Ingrediente = new Ingrediente();

    ingrediente.nombre = nombreIngrediente;
    stock.ingrediente = ingrediente;
    console.log(stock)
    toast.promise(StockIngredientesService.createStock(stock), {
      loading: 'Creando stock...',
      success: (message) => {
        clearInputs();
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
        <input type="text" required={true} onChange={(e) => { setArticuloVenta(e.target.value) }} />
        <span>Nombre del ingrediente</span>
      </div>
      <div className="inputBox">
        <input type="text" required={true} onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
        <span>Cantidad mínima del ingrediente</span>
      </div>
      <div className="inputBox">
        <input type="text" required={true} onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
        <span>Cantidad máxima del ingrediente</span>
      </div>
      <div className="inputBox">
        <input type="text" required={true} onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
        <span>Cantidad actual del ingrediente</span>
      </div>
      <label>
        <i className='bx bx-lock'></i>
        <select
          onChange={(e) => setMedida(e.target.value)}
        >
          <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
          <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
          <option value={EnumMedida.LITROS.toString()}>Litros</option>
          <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
          <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
        </select>
      </label>
      <br />
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
        <span>Costo del ingrediente por unidad de medida</span>
      </div>
      <button onClick={crearStockIngrediente}>Crear stock</button>
    </div>
  )
}

export default AgregarStockIngrediente
