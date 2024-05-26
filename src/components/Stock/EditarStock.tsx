import { useState } from 'react';
import { StockIngredientesService } from '../../services/StockIngredientesService';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { StockArticuloVentaDTO } from '../../types/Stock/StockArticuloVentaDTO';
import { StockIngredientesDTO } from '../../types/Stock/StockIngredientesDTO';
import { toast, Toaster } from 'sonner';
import '../../styles/modalFlotante.css'
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';

interface EditarStockProps {
  stockOriginal: StockArticuloVentaDTO | StockIngredientesDTO;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockOriginal }) => {

  const [cantidadActual, setCantidadActual] = useState(stockOriginal.cantidadActual);
  const [cantidadMinima, setCantidadMinima] = useState(stockOriginal.cantidadMinima);
  const [cantidadMaxima, setCantidadMaxima] = useState(stockOriginal.cantidadMaxima);
  const [medida, setMedida] = useState(stockOriginal.medida);
  const [costo, setCosto] = useState(stockOriginal.precioCompra);

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);

  const handleAbrirRecomendaciones = () => {
    setModalBusqueda(true)
  };

  const handleModalClose = () => {
    setModalBusqueda(false)
  };

  function editarStock() {
    if (!cantidadMinima || cantidadMinima < 0) {
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
    } else if (!costo || costo < 0) {
      toast.error("Por favor, es necesario el precio del ingrediente");
      return;
    } else if (cantidadMaxima < cantidadMinima) {
      toast.error("Por favor, la cantidad mínima no puede ser mayor a la máxima");
      return;
    }

    if (stockOriginal.tipo === 'ingrediente') {
      const stock: StockIngredientesDTO = new StockIngredientesDTO();

      if (medida) stock.medida = medida;
      stock.id = stockOriginal.id;
      stock.cantidadActual = cantidadActual;
      stock.cantidadMinima = cantidadMinima;
      stock.cantidadMaxima = cantidadMaxima;
      stock.borrado = 'NO';
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
      stock.borrado = 'NO';
      console.log(stock)
      toast.promise(StockArticuloVentaService.updateStock(stock), {
        loading: 'Editando stock del artículo...',
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
      <h2>Editar ingrediente</h2>
      <div className="inputBox">
        <input type="number" required={true} value={cantidadMinima | 0} onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
        <span>Cantidad mínima del ingrediente</span>
      </div><br />
      <div className="inputBox">
        <input type="number" required={true} value={cantidadMaxima | 0} onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
        <span>Cantidad máxima del ingrediente</span>
      </div><br />
      <div className="inputBox">
        <input type="number" required={true} value={cantidadActual | 0} onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
        <span>Cantidad actual del ingrediente</span>
      </div><br />
      <div className="input-filtrado">
        <InputComponent placeHolder={'Filtrar unidades de medida...'} onInputClick={() => handleAbrirRecomendaciones()} selectedProduct={medida.nombre ?? ''} />
        {modalBusqueda && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}
      </div>
      <br /><br />
      <div className="inputBox">
        <input type="text" required={true} value={costo | 0} onChange={(e) => { setCosto(parseFloat(e.target.value)) }} />
        <span>Costo del ingrediente por unidad de medida ($)</span>
      </div><br />
      <button type="button" onClick={editarStock}>Editar stock</button>
    </div>
  )
}

export default EditarStock
