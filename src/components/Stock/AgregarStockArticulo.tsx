import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { toast, Toaster } from 'sonner';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import '../../styles/modalFlotante.css'
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import { Medida } from '../../types/Ingredientes/Medida';
import ModalFlotanteRecomendacionesArticulo from '../../hooks/ModalFlotanteFiltroArticuloVenta';

function AgregarStockArticulo() {
  const [modalBusquedaArticulo, setModalBusquedaArticulo] = useState<boolean>(false);
  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);


  const handleModalClose = () => {
    setModalBusquedaArticulo(false)
    setModalBusquedaMedida(false)
  };

  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [medida, setMedida] = useState<Medida>(new Medida());
  const [articulo, setArticulo] = useState<ArticuloVenta>(new ArticuloVenta());

  async function agregarStock() {
    if (!articulo.nombre) {
      toast.error("Por favor, es necesario el nombre del articulo");
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
    } else if (cantidadActual > cantidadMaxima) {
      toast.error("Por favor, la cantidad actual no puede ser mayor a la maxima");
      return;
    } else if (cantidadActual < cantidadMinima) {
      toast.error("Por favor, la cantidad actual no puede ser menor a la minima");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesario la medida");
      return;
    } else if (!precio || precio < 0) {
      toast.error("Por favor, es necesario el precio del ingrediente");
      return;
    } else if (cantidadMaxima < cantidadMinima) {
      toast.error("Por favor, la cantidad mínima no puede ser mayor a la máxima");
      return;
    }

    const stock: StockArticuloVenta = new StockArticuloVenta();

    if (articulo) stock.articuloVenta = articulo;

    if (medida) stock.medida = medida;
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
      <h2>&mdash; Agregar artículo &mdash;</h2>
      <div>
        <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
        <InputComponent disabled={false} placeHolder='Filtrar artículo...' onInputClick={() => setModalBusquedaArticulo(true)} selectedProduct={articulo?.nombre ?? ''} />
        {modalBusquedaArticulo && <ModalFlotanteRecomendacionesArticulo datosOmitidos={articulo?.nombre} onCloseModal={handleModalClose} onSelectArticuloVenta={(articulo) => { setArticulo(articulo); handleModalClose(); }} />}
      </div>
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
      <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={medida.nombre ?? ''} />
      {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}

      <br />
      <button type="button" onClick={agregarStock}>Agregar</button>
    </div>
  )
}

export default AgregarStockArticulo
