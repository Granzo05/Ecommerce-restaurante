import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { toast, Toaster } from 'sonner';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';

function AgregarStockArticulo() {

  const [nombre, setNombre] = useState('');
  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [medida, setMedida] = useState<EnumMedida | string>('0');

  async function agregarStock() {
    if (!nombre || !cantidadActual || !cantidadMinima || !precio || !cantidadMaxima || !medida) {
      toast.info("Por favor, complete todos los campos requeridos.");
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
      <div className="inputBox">
        <input type="text" required={true} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del articulo</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
        <span>Cantidad mínima del articulo</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
        <span>Cantidad máxima del articulo</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
        <span>Cantidad actual del articulo</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
        <span>Costo por unidad de medida</span>
      </div>
      <br />
      <select
        onChange={(e) => setMedida(e.target.value)}
      >
        <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
        <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
        <option value={EnumMedida.LITROS.toString()}>Litros</option>
        <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
        <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
      </select>
      <br />
      <button type="button" onClick={agregarStock}>Agregar stock</button>
    </div>
  )
}

export default AgregarStockArticulo
