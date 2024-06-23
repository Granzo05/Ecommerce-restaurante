import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockIngredientes } from '../../types/Stock/StockIngredientes';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import '../../styles/modalFlotante.css'
import InputComponent from '../InputFiltroComponent';
import { Medida } from '../../types/Ingredientes/Medida';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesIngredientes from '../../hooks/ModalFlotanteFiltroIngredientes';
import ModalFlotanteRecomendacionesIngredientesSinStock from '../../hooks/ModalFlotanteFiltroIngredientesSinStock';

interface AgregarStockIngredienteProps {
  onCloseModal: () => void;
}


const AgregarStockIngrediente: React.FC<AgregarStockIngredienteProps> = ({ onCloseModal }) => {

  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [medida, setMedida] = useState<Medida>(new Medida());
  const [costoIngrediente, setCostoIngrediente] = useState(0);
  const [nombreIngrediente] = useState('0');

  const [ingrediente, setIngrediente] = useState<Ingrediente>(new Ingrediente());

  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);

  const [modalBusquedaIngrediente, setModalBusquedaIngrediente] = useState<boolean>(false);


  const handleModalClose = () => {
    setModalBusquedaMedida(false)
    setModalBusquedaIngrediente(false)
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
    } else if (cantidadActual > cantidadMaxima) {
      toast.error("Por favor, la cantidad actual no puede ser mayor a la maxima");
      return;
    } else if (cantidadActual < cantidadMinima) {
      toast.error("Por favor, la cantidad actual no puede ser menor a la minima");
      return;
    }

    const stock: StockIngredientes = new StockIngredientes();
    stock.cantidadActual = cantidadActual;
    stock.cantidadMinima = cantidadMinima;
    stock.cantidadMaxima = cantidadMaxima;
    stock.precioCompra = costoIngrediente;

    if (medida) stock.medida = medida;

    stock.borrado = 'NO';

    stock.ingrediente = ingrediente;

    console.log(stock)

    toast.promise(StockIngredientesService.updateStock(stock), {
      loading: 'Creando stock...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
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
      <h2>&mdash; Agregar stock ingrediente &mdash;</h2>
      <div>
        <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
        <InputComponent disabled={false} placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={ingrediente.nombre ?? ''} />
        {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientesSinStock datosOmitidos={ingrediente?.nombre} onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { console.log(ingrediente); setIngrediente(ingrediente); handleModalClose(); }} />}
      </div>

      <label>
        <div className="inputBox">
          <input type="text" required pattern="\d*" onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
          <span>Cantidad mínima del ingrediente</span>
          <div className="error-message">La cantidad mínima solo debe contener números.</div>

        </div>
      </label>
      <label>
        <div className="inputBox">
          <input type="text" required pattern="\d*" onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
          <span>Cantidad máxima del ingrediente</span>
          <div className="error-message">La cantidad máxima solo debe contener números.</div>

        </div>

      </label>
      <label>
        <div className="inputBox">
          <input type="text" required pattern="\d*" onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
          <span>Cantidad actual del ingrediente</span>
          <div className="error-message">La cantidad actual solo debe contener números.</div>

        </div>

      </label>
      <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={ingrediente.medida?.nombre ?? medida.nombre ?? ''} />
      {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}
      <div className="inputBox">
        <input type="text" required pattern="\d*" id="costoStock" onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
        <span>Costo del ingrediente por una unidad de medida ($)</span>
        <div className="error-message">El costo por unidad solo debe contener números.</div>

      </div>
      <br />
      <div className="btns-pasos">
      <button className='btn-accion-completar' onClick={crearStockIngrediente}>Agregar stock ✓</button>

      </div>
    </div>
  )
}

export default AgregarStockIngrediente
