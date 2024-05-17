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
      <br />
      <input type="text" placeholder="Nombre del articulo" onChange={(e) => { setNombre(e.target.value) }} />
      <br />
      <input type="number" placeholder="Cantidad mínima del articulo" onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
      <br />
      <input type="number" placeholder="Cantidad máxima del articulo" onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
      <br />
      <input type="number" placeholder="Cantidad actual del articulo" onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
      <br />
      <input type="number" placeholder="Costo" onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />

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
