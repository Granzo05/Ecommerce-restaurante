import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { Toaster, toast } from 'sonner'
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockIngredientes } from '../../types/Stock/StockIngredientes';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import '../../styles/modalFlotante.css'
import InputComponent from '../InputFiltroComponent';
import { Medida } from '../../types/Ingredientes/Medida';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';

function AgregarStockIngrediente() {

  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [medida, setMedida] = useState<Medida>(new Medida());
  const [costoIngrediente, setCostoIngrediente] = useState(0);
  const [nombreIngrediente, setArticuloVenta] = useState('0');

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);

  const handleAbrirRecomendaciones = () => {
    setModalBusqueda(true)
  };

  const handleModalClose = () => {
    setModalBusqueda(false)
  };

  async function crearStockIngrediente() {
    if (!medida && !cantidadMaxima && !costoIngrediente && !cantidadMinima && !cantidadActual && !nombreIngrediente) {
      toast.error("Por favor, llene todos los campos");
      return;
    } else if (!cantidadMinima || cantidadMinima < 0) {
      toast.error("Por favor, es necesaria la cantidad mínima");
      return;
    } else if (!cantidadMaxima || cantidadMaxima < 0) {
      toast.error("Por favor, es necesaria la cantidad máxima");
      return;
    } else if (!cantidadActual || cantidadActual < 0) {
      toast.error("Por favor, es necesaria la cantidad actual");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesario la medida");
      return;
    } else if (!costoIngrediente || costoIngrediente < 0) {
      toast.error("Por favor, es necesario el precio del ingrediente");
      return;
    } else if (cantidadMaxima < cantidadMinima) {
      toast.error("Por favor, la cantidad mínima no puede ser mayor a la máxima");
      return;
    } else if (!nombreIngrediente) {
      toast.error("Por favor, es necesario el nombre del ingrediente");
      return;
    }

    const stock: StockIngredientes = new StockIngredientes();
    stock.cantidadActual = cantidadActual;
    stock.cantidadMinima = cantidadMinima;
    stock.cantidadMaxima = cantidadMaxima;
    stock.precioCompra = costoIngrediente;

    if (medida) stock.medida = medida;

    const ingrediente: Ingrediente = new Ingrediente();
    stock.borrado = 'NO';

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
      <h2>Agregar ingrediente</h2>
      <label>
        <div className="inputBox">
          <input type="text" required onChange={(e) => { setArticuloVenta(e.target.value) }} />
          <span>Nombre del ingrediente</span>
        </div>
      </label>
      <label>
        <div className="inputBox">
          <input type="text" required onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
          <span>Cantidad mínima del ingrediente</span>
        </div>
      </label>
      <label>
        <div className="inputBox">
          <input type="text" required onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
          <span>Cantidad máxima del ingrediente</span>
        </div>

      </label>
      <label>
        <div className="inputBox">
          <input type="text" required onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
          <span>Cantidad actual del ingrediente</span>
        </div>

      </label>
      <label>
        <div className="input-filtrado">
          <InputComponent placeHolder={'Filtrar unidades de medida...'} onInputClick={() => handleAbrirRecomendaciones()} selectedProduct={medida.nombre ?? ''} />
          {modalBusqueda && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}
        </div>
      </label>
      <label>
        <div className="inputBox">
          <input type="text" required id="costoStock" onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
          <span>Costo del ingrediente por una unidad de medida ($) (opcional)</span>
        </div>
      </label>
      <button onClick={crearStockIngrediente}>Agregar</button>
    </div>
  )
}

export default AgregarStockIngrediente
