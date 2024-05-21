import { useEffect, useState } from 'react';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { DetalleStock } from '../../types/Stock/DetalleStock';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { toast, Toaster } from 'sonner';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';
import { IngredienteService } from '../../services/IngredienteService';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';

function AgregarStockEntrante() {

  const [fecha, setFecha] = useState(new Date());

  // Con estos inputs voy rellenando en caso de ser necesario agregar más campos
  const [articulosVentaInputs, setArticulosVentaInputs] = useState<ArticuloVenta[]>([]);
  const [ingredientesInputs, setIngredientesInputs] = useState<Ingrediente[]>([]);

  let [lastIndexDetalle] = useState<number>(0);

  const [articulosVenta, setArticulosVenta] = useState<ArticuloVenta[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

  // Aca almaceno los detalles para el stock
  const [detallesStock] = useState<DetalleStock[]>([])

  useEffect(() => {
    IngredienteService.getIngredientes()
      .then(ingredientes => {
        setIngredientes(ingredientes)
      })
      .catch(error => {
        console.error('Error:', error);
      });

    ArticuloVentaService.getArticulos()
      .then(articulos => {
        setArticulosVenta(articulos)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


  // Almacenaje de cada detalle por ingrediente
  const handleNombreIngredienteChange = (index: number, ingrediente: Ingrediente) => {
    detallesStock[index].ingrediente = ingrediente;
  };

  const handleNombreArticuloChange = (index: number, articulo: ArticuloVenta) => {
    // Busco todos los articulos que de nombre se parezcan
    detallesStock[index].articuloVenta = articulo;
  };

  const almacenarCantidad = (index: number, cantidad: number) => {
    if (cantidad) {
      detallesStock[index].cantidad = cantidad;
    }
  };

  const almacenarSubTotal = (index: number, costo: number) => {
    if (costo) {
      detallesStock[index].costoUnitario = costo;
      detallesStock[index].subTotal = costo * detallesStock[index].cantidad;
    }
  };

  const añadirCampoIngrediente = () => {
    setIngredientesInputs([...ingredientesInputs, { id: 0, nombre: '', stock: null, medida: '', borrado: 'NO' }]);

    if (lastIndexDetalle !== 0) lastIndexDetalle++;
  };

  const quitarCampoIngrediente = () => {
    if (ingredientesInputs.length > 0) {
      const nuevosIngredientes = [...ingredientesInputs];
      nuevosIngredientes.pop();
      setIngredientesInputs(nuevosIngredientes);
    }
  };


  const añadirCampoArticulo = () => {
    setArticulosVentaInputs([...articulosVentaInputs, {
      id: 0, tipo: '', medida: '', cantidad: 0, cantidadMedida: 0, nombre: '', precioVenta: 0,
      imagenes: [], imagenesDTO: [], promociones: [], borrado: 'NO'
    }]);
  };

  const quitarCampoArticulo = () => {
    if (articulosVentaInputs.length > 0) {
      const nuevosArticulos = [...articulosVentaInputs];
      nuevosArticulos.pop();
      setArticulosVentaInputs(nuevosArticulos);
    }
  };

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [elementosABuscar, setElementosABuscar] = useState<string>('');

  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
  };

  const handleAbrirRecomendaciones = (busqueda: string) => {
    setElementosABuscar(busqueda)
    setModalBusqueda(true);
  };

  const handleModalClose = () => {
    setModalBusqueda(false)

    let articulo = articulosVenta.find(articulo => articulo.nombre === selectedProduct);

    let ingrediente = ingredientes.find(ingrediente => ingrediente.nombre === selectedProduct);

    if (selectedProduct && ingrediente) {
      handleNombreIngredienteChange(lastIndexDetalle, ingrediente);
    } else if (selectedProduct && articulo) {
      handleNombreArticuloChange(lastIndexDetalle, articulo);
    }
  };

  async function agregarStockEntrante() {
    if (!fecha) {
      toast.error("Por favor, la fecha es necesaria");
      return;
    } else if (detallesStock.length === 0 && (detallesStock[0].ingrediente?.nombre.match('') || (detallesStock[0].articuloVenta?.nombre.match('')))) {
      toast.error("Por favor, es necesario asignar un producto de venta o un ingrediente");
      return;
    }

    const stockEntrante: StockEntrante = new StockEntrante();

    stockEntrante.fechaLlegada = fecha;
    stockEntrante.detallesStock = detallesStock;
    stockEntrante.borrado = 'NO';

    toast.promise(StockEntranteService.createStock(stockEntrante), {
      loading: 'Creando stock entrante...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <h2>Agregar stock entrante</h2>
      <Toaster />
      <div className="inputBox">
        <input type="date" required={true} onChange={(e) => { setFecha(new Date(e.target.value)) }} />
        <span>Fecha de entrada</span>
      </div>
      {ingredientesInputs.map((ingrediente, index) => (
        <div className='div-ingrediente-menu' key={index}>
          <div>
            <InputComponent placeHolder='Seleccionar ingrediente...' onInputClick={() => handleAbrirRecomendaciones('INGREDIENTES')} selectedProduct={ingrediente?.nombre ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}
          </div>
          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarCantidad(lastIndexDetalle, parseFloat(e.target.value))} />
            <span>Cantidad del ingrediente</span>
          </div>
          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarSubTotal(lastIndexDetalle, parseFloat(e.target.value))} />
            <span>Costo unitario</span>
          </div>
          <p onClick={quitarCampoIngrediente}>X</p>
        </div>
      ))}
      <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>

      <br />

      {articulosVentaInputs.map((articulo, index) => (
        <div className='div-ingrediente-menu' key={index}>
          <div>
            <InputComponent placeHolder='Seleccionar ingrediente...' onInputClick={() => handleAbrirRecomendaciones('ARTICULOS')} selectedProduct={articulo?.nombre ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}
          </div>
          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarCantidad(lastIndexDetalle, parseFloat(e.target.value))} />
            <span>Cantidad del articulo</span>
          </div>
          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarSubTotal(lastIndexDetalle, parseFloat(e.target.value))} />
            <span>Costo unitario</span>
          </div>
          <p onClick={quitarCampoArticulo}>X</p>
        </div>
      ))}
      <button onClick={añadirCampoArticulo}>Añadir articulo</button>

      <button type="button" onClick={agregarStockEntrante}>Agregar stock entrante</button>
    </div >
  )
}

export default AgregarStockEntrante
