import { useEffect, useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { toast, Toaster } from 'sonner';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { StockArticuloVentaService } from '../../services/StockArticulosService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import '../../styles/modalFlotante.css'
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';

function AgregarStockArticulo() {

  useEffect(() => {
    ArticuloVentaService.getArticulos()
      .then(articulos => {
        setArticulos(articulos);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // Modal flotante de ingrediente
  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [elementosABuscar, setElementosABuscar] = useState<string>('');

  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
    setNombre(selectedProduct);
    setInputArticulo(selectedProduct);
  };

  const handleAbrirRecomendaciones = (busqueda: string) => {
    setElementosABuscar(busqueda)
    if (!selectedProduct) setModalBusqueda(true);
  };

  const handleModalClose = () => {
    setModalBusqueda(false);
    if(selectedProduct) {
      handleSelectProduct(selectedProduct)
    }
  };


  const [articulos, setArticulos] = useState<ArticuloVenta[]>([]);
  const [inputArticulo, setInputArticulo] = useState('');
  const [nombre, setNombre] = useState('');
  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [medida, setMedida] = useState<EnumMedida | string>('0');

  async function agregarStock() {
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
    } else if (!precio || precio < 0) {
      toast.error("Por favor, es necesario el precio del ingrediente");
      return;
    } else if (cantidadMaxima < cantidadMinima) {
      toast.error("Por favor, la cantidad mínima no puede ser mayor a la máxima");
      return;
    } else if (!nombre) {
      toast.error("Por favor, es necesario el nombre del articulo");
      return;
    }

    const stock: StockArticuloVenta = new StockArticuloVenta();

    let articulo = articulos.find(articulo => articulo.nombre === inputArticulo);

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
      <h2>Agregar artículo</h2>
      <label>
        <div className="inputBox">
          <InputComponent placeHolder='Buscar artículo...' onInputClick={() => handleAbrirRecomendaciones('ARTICULOS')} selectedProduct={inputArticulo} />
          {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}
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
