import { useState } from 'react';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { DetalleStock } from '../../types/Stock/DetalleStock';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { toast, Toaster } from 'sonner';
import InputComponent from '../InputFiltroComponent';
import '../../styles/modalCrud.css'
import { Medida } from '../../types/Ingredientes/Medida';
import { Categoria } from '../../types/Ingredientes/Categoria';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesIngredientes from '../../hooks/ModalFlotanteFiltroIngredientes';
import ModalFlotanteRecomendacionesArticulo from '../../hooks/ModalFlotanteFiltroArticuloVenta';

function AgregarStockEntrante() {

  const [fecha, setFecha] = useState(new Date());

  // Con estos inputs voy rellenando en caso de ser necesario agregar más campos
  const [articulosVentaInputs, setArticulosVentaInputs] = useState<ArticuloVenta[]>([]);
  const [ingredientesInputs, setIngredientesInputs] = useState<Ingrediente[]>([]);

  let lastIndexDetalle = 0;

  // Aca almaceno los detalles para el stock
  const [detallesStock, setDetallesStock] = useState<DetalleStock[]>([])

  // Almacenaje de cada detalle por ingrediente
  const handleIngredienteChange = (ingrediente: Ingrediente) => {
    detallesStock[lastIndexDetalle].ingrediente = ingrediente;
  };

  const handleArticuloChange = (articulo: ArticuloVenta) => {
    // Busco todos los articulos que de nombre se parezcan
    detallesStock[lastIndexDetalle].articuloVenta = articulo;
  };

  const handleCantidad = (cantidad: number) => {
    if (cantidad) {
      detallesStock[lastIndexDetalle].cantidad = cantidad;
    }
  };

  const handleMedida = (medida: Medida) => {
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
    setIngredientesInputs([...ingredientesInputs, { id: 0, nombre: '', stock: null, medida: new Medida(), borrado: 'NO' }]);
    setDetallesStock([...detallesStock, { id: 0, cantidad: 0, costoUnitario: 0, subTotal: 0, medida: new Medida(), ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }]);
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
      id: 0, categoria: new Categoria(), medida: new Medida(), cantidad: 0, cantidadMedida: 0, nombre: '', precioVenta: 0,
      imagenes: [], imagenesDTO: [], promociones: [], borrado: 'NO'
    }]);
    setDetallesStock([...detallesStock, { id: 0, cantidad: 0, costoUnitario: 0, subTotal: 0, medida: new Medida(), ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }]);
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

  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);
  const [modalBusquedaArticulo, setModalBusquedaArticulo] = useState<boolean>(false);
  const [modalBusquedaIngrediente, setModalBusquedaIngrediente] = useState<boolean>(false);


  const handleModalClose = () => {
    setModalBusquedaMedida(false)
    setModalBusquedaArticulo(false)
    setModalBusquedaIngrediente(false)
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
          <div>
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
            <InputComponent placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={ingrediente?.nombre ?? ''} />
            {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientes onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { handleIngredienteChange(ingrediente) }} />}
          </div>
          <div className="input-filtrado">
            <InputComponent placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={ingrediente.medida.nombre ?? ''} />
            {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedida(medida); handleModalClose(); }} />}
          </div>
          <br />

          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => handleCantidad(parseFloat(e.target.value))} />
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
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
            <InputComponent placeHolder='Filtrar artículo...' onInputClick={() => setModalBusquedaArticulo(true)} selectedProduct={articulo.nombre ?? ''} />
            {modalBusquedaArticulo && <ModalFlotanteRecomendacionesArticulo onCloseModal={handleModalClose} onSelectArticuloVenta={(articulo) => { handleArticuloChange(articulo); handleModalClose(); }} />}
          </div>
          <div className="input-filtrado">
            <InputComponent placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={articulo.medida.nombre ?? ''} />
            {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedida(medida); handleModalClose(); }} />}
          </div>
          <br />
          <br />

          <div className="inputBox">
            <input type="number" required={true} onChange={(e) => handleCantidad(parseFloat(e.target.value))} />
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
