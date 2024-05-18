import { useState } from 'react';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { StockArticuloVentaDTO } from '../../types/Stock/StockArticuloVentaDTO';
import { StockIngredientesDTO } from '../../types/Stock/StockIngredientesDTO';
import { toast, Toaster } from 'sonner';
import { convertirStringAEnumMedida } from '../../utils/global_variables/functions';

interface EditarStockProps {
  stockOriginal: StockArticuloVentaDTO | StockIngredientesDTO;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockOriginal }) => {

  const [cantidadActual, setCantidadActual] = useState(stockOriginal.cantidadActual);
  const [cantidadMinima, setCantidadMinima] = useState(stockOriginal.cantidadMinima);
  const [cantidadMaxima, setCantidadMaxima] = useState(stockOriginal.cantidadMaxima);
  const [medida, setMedida] = useState(stockOriginal.medida);
  const [costo, setCosto] = useState(stockOriginal.precioCompra);

  function editarStock() {
    if (!cantidadActual || !cantidadMinima || !costo || !cantidadMaxima || !medida) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    if (stockOriginal.tipo === 'ingrediente') {
      const stock: StockIngredientesDTO = new StockIngredientesDTO();

      if (medida) stock.medida = medida;
      stock.id = stockOriginal.id;
      stock.cantidadActual = cantidadActual;
      stock.cantidadMinima = cantidadMinima;
      stock.cantidadMaxima = cantidadMaxima;
      stock.precioCompra = costo;
      toast.promise(StockIngredientesService.updateStock(stock), {
        loading: 'Creando stock del ingrediente...',
        success: (message) => {
          return message;
        },
        error: (message) => {
          return message;
        },
      });

    } else {
      const stock: StockArticuloVentaDTO = new StockArticuloVentaDTO();

      if (medida) stock.medida = medida;
      stock.cantidadActual = cantidadActual;
      stock.cantidadMinima = cantidadMinima;
      stock.cantidadMaxima = cantidadMaxima;
      stock.precioCompra = costo;
      stock.id = stockOriginal.id;

      console.log(stock)
      toast.promise(StockArticuloVentaService.updateStock(stock), {
        loading: 'Creando stock del artículo...',
        success: (message) => {
          return message;
        },
        error: (message) => {
          return message;
        },
      });
    }

  }

  return (
    <div className="modal-info">
      <Toaster />
      <div className="inputBox">
        <input type="number" required={true} value={cantidadMinima | 0} onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
        <span>Cantidad mínima del ingrediente</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} value={cantidadMaxima | 0} onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
        <span>Cantidad máxima del ingrediente</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} value={cantidadActual | 0} onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
        <span>Cantidad actual del ingrediente</span>
      </div>
      <select value={medida?.toString()} onChange={(e) => { setMedida(convertirStringAEnumMedida(e.target.value)) }}>
        <option>Seleccionar medida ingrediente</option>
        <option value="KILOGRAMOS">Kilogramos</option>
        <option value="GRAMOS">Gramos</option>
        <option value="LITROS">Litros</option>
        <option value="CENTIMETROS_CUBICOS">Centimetros cúbicos</option>
        <option value="PAQUETES">Paquetes</option>
        <option value="UNIDADES">Unidades</option>
      </select>
      <div className="inputBox">
        <input type="text" required={true} value={costo | 0} onChange={(e) => { setCosto(parseFloat(e.target.value)) }} />
        <span>Costo del ingrediente por unidad de medida</span>
      </div>
      <button type="button" onClick={editarStock}>Editar stock</button>
    </div>
  )
}

export default EditarStock
