import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { toast, Toaster } from 'sonner';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import '../../styles/modalFlotante.css'

function AgregarStockArticulo() {

  const [nombre, setNombre] = useState('');
  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [medida, setMedida] = useState<EnumMedida | string>('0');

  async function agregarStock() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!cantidadActual) {
      toast.error("Por favor, es necesaria la cantidad actual");
      return;
    } else if (!cantidadMinima) {
      toast.error("Por favor, es necesaria la cantidad mínima");
      return;
    } else if (!precio) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!cantidadMaxima) {
      toast.error("Por favor, es necesaria la cantidad máxima");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesario la medida");
      return;
    }

    const stock: StockArticuloVenta = new StockArticuloVenta();

    let articulo: ArticuloVenta = new ArticuloVenta();
    articulo.nombre = nombre;

    if (medida) stock.medida = medida;
    stock.articuloVenta = articulo;
    stock.cantidadActual = cantidadActual;
    stock.cantidadMinima = cantidadMinima;
    stock.cantidadMaxima = cantidadMaxima;
    stock.precioCompra = precio;
    stock.borrado = 'NO';

    toast.promise(StockArticuloVentaService.createStock(stock), {
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
      <h2>Agregar artículo</h2>
      <label>
      <div className="inputBox">
        <input type="text" required onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del articulo</span>
      </div>
      </label>
      <label>
      <div className="inputBox">
        <input type="number" required onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
        <span>Cantidad mínima del articulo</span>
      </div>
      </label>
      <label>
      <div className="inputBox">
        <input type="number" required onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
        <span>Cantidad máxima del articulo</span>
      </div>
      </label>
      <label>
      <div className="inputBox">
        <input type="number" required onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
        <span>Cantidad actual del articulo</span>
      </div>
      </label>
      <label>
      <div className="inputBox">
        <input type="number" required onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
        <span>Costo ($)</span>
      </div>
      </label>
      <label>
        <div className="inputBox">
          <select
            onChange={(e) => setMedida(e.target.value)}
            defaultValue="" // Establece el valor por defecto
          >
            <option value="" disabled hidden>Seleccione la unidad de medida</option>
            <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
            <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
            <option value={EnumMedida.LITROS.toString()}>Litros</option>
            <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
            <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
          </select>
        </div>
      </label>
      <br />
      <button type="button" onClick={agregarStock}>Agregar</button>
    </div>
  )
}

export default AgregarStockArticulo
