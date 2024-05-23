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
import '../../styles/modalCrud.css'
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';

function AgregarStockEntrante() {

  const [fecha, setFecha] = useState(new Date());

  // Con estos inputs voy rellenando en caso de ser necesario agregar más campos
  const [articulosVentaInputs, setArticulosVentaInputs] = useState<ArticuloVenta[]>([]);
  const [ingredientesInputs, setIngredientesInputs] = useState<Ingrediente[]>([]);

  let lastIndexDetalle = 0;

  const [articulosVenta, setArticulosVenta] = useState<ArticuloVenta[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

  // Aca almaceno los detalles para el stock
  const [detallesStock, setDetallesStock] = useState<DetalleStock[]>([])

  useEffect(() => {
    IngredienteService.getIngredientes()
      .then(ingredientes => {
        console.log(ingredientes)
        setIngredientes(ingredientes)
      })
      .catch(error => {
        console.error('Error:', error);
      });

    ArticuloVentaService.getArticulos()
      .then(articulos => {
        console.log(articulos)
        setArticulosVenta(articulos)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


  // Almacenaje de cada detalle por ingrediente
  const handleNombreIngredienteChange = (ingrediente: Ingrediente) => {
    detallesStock[lastIndexDetalle].ingrediente = ingrediente;
  };

  const handleNombreArticuloChange = (articulo: ArticuloVenta) => {
    // Busco todos los articulos que de nombre se parezcan
    detallesStock[lastIndexDetalle].articuloVenta = articulo;
  };

  const almacenarCantidad = (cantidad: number) => {
    if (cantidad) {
      detallesStock[lastIndexDetalle].cantidad = cantidad;
    }
  };

  const almacenarMedida = (medida: EnumMedida | string) => {
    if (medida) {
      detallesStock[lastIndexDetalle].medida = medida;
    }
  };

  const almacenarSubTotal = (costo: number) => {
    if (costo) {
      detallesStock[lastIndexDetalle].costoUnitario = costo;
      detallesStock[lastIndexDetalle].subTotal = costo * detallesStock[lastIndexDetalle].cantidad;
    }
  };

  const añadirCampoIngrediente = () => {
    setIngredientesInputs([...ingredientesInputs, { id: 0, nombre: '', stock: null, medida: '', borrado: 'NO' }]);
    setDetallesStock([...detallesStock, { id: 0, cantidad: 0, costoUnitario: 0, subTotal: 0, medida: EnumMedida.KILOGRAMOS, ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }]);
    const ultimoDetalle = detallesStock[lastIndexDetalle];

    if (
      (ultimoDetalle.ingrediente && ultimoDetalle.ingrediente.nombre.length > 2) ||
      (ultimoDetalle.articuloVenta && ultimoDetalle.articuloVenta.nombre.length > 2)
    ) {
      lastIndexDetalle++;
    }
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
    setDetallesStock([...detallesStock, { id: 0, cantidad: 0, costoUnitario: 0, subTotal: 0, medida: EnumMedida.KILOGRAMOS, ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }]);
    const ultimoDetalle = detallesStock[lastIndexDetalle];

    if (
      (ultimoDetalle.ingrediente && ultimoDetalle.ingrediente.nombre.length > 2) ||
      (ultimoDetalle.articuloVenta && ultimoDetalle.articuloVenta.nombre.length > 2)
    ) {
      lastIndexDetalle++;
    }
  };

  const quitarCampoArticulo = () => {
    if (articulosVentaInputs.length > 0) {
      const nuevosArticulos = [...articulosVentaInputs];
      nuevosArticulos.pop();
      setArticulosVentaInputs(nuevosArticulos);
    }
  };

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const [elementosABuscar, setElementosABuscar] = useState<string>('');

  const handleSelectProduct = (product: string) => {
    console.log(articulosVenta)
    let articulo = articulosVenta.find(articulo => articulo.nombre === product);

    let ingrediente = ingredientes.find(ingrediente => ingrediente.nombre === product);

    if (product && ingrediente) {
      handleNombreIngredienteChange(ingrediente);
    } else if (product && articulo) {
      handleNombreArticuloChange(articulo);
    }

    setModalBusqueda(false);
  };

  const handleAbrirRecomendaciones = (busqueda: string) => {
    setElementosABuscar(busqueda)
    setModalBusqueda(true);
  };

  const handleModalClose = () => {
    setModalBusqueda(false)
  };

  async function agregarStockEntrante() {
    const hoy = new Date();
    const fechaIngresada = new Date(fecha);

    if (!fecha) {
      toast.error("Por favor, la fecha es necesaria");
      return;
    }

    if (fechaIngresada <= hoy) {
      toast.error("Por favor, la fecha debe ser posterior a la fecha actual");
      return;
    }

    if (detallesStock.length === 0 ||
      (!detallesStock[0].ingrediente?.nombre && !detallesStock[0].articuloVenta?.nombre)) {
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
        <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de entrada:</label>
        <input type="date" required={true} onChange={(e) => { setFecha(new Date(e.target.value)) }} />
      </div>
      {ingredientesInputs.map((ingrediente, index) => (
        <div key={index}>
          <hr />
          <p className='cierre-ingrediente' onClick={quitarCampoIngrediente}>X</p>
          <div className='inputBox'>
            <InputComponent placeHolder='Filtrar ingrediente...' onInputClick={() => handleAbrirRecomendaciones('INGREDIENTES')} selectedProduct={detallesStock[lastIndexDetalle]?.ingrediente?.nombre ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}
          </div>
          <select
            id={`select-medidas-ingredientes-${index}`}
            onChange={(e) => almacenarMedida(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled hidden>Seleccionar medida ingrediente</option>
            <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
            <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
            <option value={EnumMedida.LITROS.toString()}>Litros</option>
            <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
            <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
          </select>
          <br />

          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarCantidad(parseFloat(e.target.value))} />
            <span>Cantidad del ingrediente</span>
          </div>
          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarSubTotal(parseFloat(e.target.value))} />
            <span>Costo unitario ($)</span>
          </div>
        </div>
      ))}
      <button onClick={añadirCampoIngrediente}>+ Añadir ingrediente</button>
      <br />
      {articulosVentaInputs.map((articulo, index) => (
        <div key={index}>
          <hr />
          <p className='cierre-ingrediente' onClick={quitarCampoArticulo}>X</p>
          <div>
            <InputComponent placeHolder='Filtrar artículo...' onInputClick={() => handleAbrirRecomendaciones('ARTICULOS')} selectedProduct={detallesStock[lastIndexDetalle]?.articuloVenta?.nombre ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}
          </div>
          <select
            id={`select-medidas-articulos-${index}`}
            onChange={(e) => almacenarMedida(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled hidden>Seleccionar medida ingrediente</option>
            <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
            <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
            <option value={EnumMedida.LITROS.toString()}>Litros</option>
            <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
            <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
          </select>
          <br />
          <br />

          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarCantidad(parseFloat(e.target.value))} />
            <span>Cantidad del articulo</span>
          </div>

          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => almacenarSubTotal(parseFloat(e.target.value))} />
            <span>Costo unitario ($)</span>
          </div>

        </div>
      ))}
      <button onClick={añadirCampoArticulo}>+ Añadir artículo</button>
      <hr />
      <button type="button" onClick={agregarStockEntrante}>Agregar stock entrante</button>
    </div >
  )
}

export default AgregarStockEntrante
