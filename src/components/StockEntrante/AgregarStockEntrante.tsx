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
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesIngredientes from '../../hooks/ModalFlotanteFiltroIngredientes';
import ModalFlotanteRecomendacionesArticulo from '../../hooks/ModalFlotanteFiltroArticuloVenta';
import { formatearFechaYYYYMMDD } from '../../utils/global_variables/functions';

interface AgregarStockEntranteProps {
  onCloseModal: () => void;
}


const AgregarStockEntrante: React.FC<AgregarStockEntranteProps> = ({ onCloseModal }) => {
  const [fecha, setFecha] = useState(new Date());

  // Aca almaceno los detalles para el stock
  const [detallesIngredienteStock, setDetallesIngredientesStock] = useState<DetalleStock[]>([])
  const [detallesArticuloStock, setDetallesArticuloStock] = useState<DetalleStock[]>([])

  const [nombresArticulos, setNombresArticulos] = useState<string[]>([]);
  const [nombresIngredientes, setNombresIngredientes] = useState<string[]>([]);

  // Almacenaje de cada detalle por ingrediente
  const handleIngredienteChange = (ingrediente: Ingrediente, index: number) => {
    setDetallesIngredientesStock(prevState => {
      const newState = [...prevState];
      newState[index].ingrediente = ingrediente;

      const nuevosNombresIngredientes = [...nombresIngredientes];
      nuevosNombresIngredientes[index] = ingrediente.nombre;
      setNombresIngredientes(nuevosNombresIngredientes);

      return newState;
    });
  };

  const handleCantidadIngrediente = (cantidad: number, index: number) => {
    if (cantidad) {
      setDetallesIngredientesStock(prevState => {
        const newState = [...prevState];
        newState[index].cantidad = cantidad;
        return newState;
      });
    }
  };

  const handleMedidaIngrediente = (medida: Medida, index: number) => {
    if (medida) {
      setDetallesIngredientesStock(prevState => {
        const newState = [...prevState];
        newState[index].medida = medida;
        return newState;
      });
    }
  };

  const almacenarSubTotalIngrediente = (costo: number, index: number) => {
    if (costo) {
      setDetallesIngredientesStock(prevState => {
        const newState = [...prevState];
        newState[index].costoUnitario = costo;
        return newState;
      });
    }
  };

  const handleArticuloChange = (articulo: ArticuloVenta, index: number) => {
    setDetallesArticuloStock(prevState => {
      const newState = [...prevState];
      newState[index].articuloVenta = articulo;

      const nuevosNombresArticulos = [...nombresArticulos];
      nuevosNombresArticulos[index] = articulo.nombre;
      setNombresArticulos(nuevosNombresArticulos);

      return newState;
    });
  };

  const handleCantidadArticulo = (cantidad: number, index: number) => {
    if (cantidad) {
      setDetallesArticuloStock(prevState => {
        const newState = [...prevState];
        newState[index].cantidad = cantidad;
        return newState;
      });
    }
  };

  const handleMedidaArticulo = (medida: Medida, index: number) => {
    if (medida) {
      setDetallesArticuloStock(prevState => {
        const newState = [...prevState];
        newState[index].medida = medida;
        return newState;
      });
    }
  };

  const almacenarSubTotalArticulo = (costo: number, index: number) => {
    if (costo) {
      setDetallesArticuloStock(prevState => {
        const newState = [...prevState];
        newState[index].costoUnitario = costo;
        return newState;
      });
    }
  };

  const añadirCampoIngrediente = () => {
    setDetallesIngredientesStock(prevState => {
      const newState = [...prevState, { id: 0, cantidad: 0, costoUnitario: 0, subtotal: 0, medida: new Medida(), ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }];
      return newState;
    });
  };

  const añadirCampoArticulo = () => {
    setDetallesArticuloStock(prevState => {
      const newState = [...prevState, { id: 0, cantidad: 0, costoUnitario: 0, subtotal: 0, medida: new Medida(), ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }];
      return newState;
    });
  };

  const quitarCampoIngrediente = () => {
    setDetallesIngredientesStock(prevState => {
      const newState = prevState.slice(0, -1);
      return newState;
    });
  };

  const quitarCampoArticulo = () => {
    setDetallesArticuloStock(prevState => {
      const newState = prevState.slice(0, -1);
      return newState;
    });
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

    if ((!detallesIngredienteStock[0].ingrediente?.nombre.length && !detallesArticuloStock[0].articuloVenta?.nombre)) {
      toast.error("Por favor, es necesario asignar un producto de venta o un ingrediente");
      return;
    }

    const stockEntrante: StockEntrante = new StockEntrante();

    stockEntrante.fechaLlegada = fecha;
    stockEntrante.borrado = 'NO';

    const detallesStock: DetalleStock[] = [];

    detallesIngredienteStock.forEach(detalle => {
      if (detalle.ingrediente?.nombre && detalle.ingrediente?.nombre.length > 2) detallesStock.push(detalle);
    });

    detallesArticuloStock.forEach(detalle => {
      if (detalle.articuloVenta?.nombre && detalle.articuloVenta?.nombre.length > 2) detallesStock.push(detalle);
    });

    stockEntrante.detallesStock = detallesStock;

    toast.promise(StockEntranteService.createStock(stockEntrante), {
      loading: 'Creando stock entrante...',
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

  //SEPARAR EN PASOS
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Paso 1 - Datos</h4>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de entrada:</label>
              <input type="date" required={true} value={formatearFechaYYYYMMDD(fecha)} onChange={(e) => { setFecha(new Date(e.target.value)) }} />
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Agregar ingrediente al stock entrante</h4>
            {detallesIngredienteStock.map((ingrediente, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={quitarCampoIngrediente}>X</p>
                <h4>Ingrediente {index + 1}</h4>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
                  <InputComponent disabled={false} placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={detallesIngredienteStock[index].ingrediente?.nombre ?? ''} />
                  {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientes datosOmitidos={nombresIngredientes} onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { handleIngredienteChange(ingrediente, index); handleModalClose(); }} />}
                </div>
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
                <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={detallesIngredienteStock[index]?.ingrediente.medida?.nombre ?? detallesIngredienteStock[index]?.medida?.nombre ?? ''} />
                {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={detallesIngredienteStock[index]?.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaIngrediente(medida, index); handleModalClose(); }} />}

                <div className="inputBox">
                  <input type="number" required={true} value={detallesIngredienteStock[index]?.cantidad} onChange={(e) => handleCantidadIngrediente(parseFloat(e.target.value), index)} />
                  <span>Cantidad de unidades</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={detallesIngredienteStock[index]?.costoUnitario} onChange={(e) => almacenarSubTotalIngrediente(parseFloat(e.target.value), index)} />
                  <span>Costo unitario ($)</span>
                </div>
              </div>
            ))}
            <button onClick={añadirCampoIngrediente}>+ Añadir ingrediente</button>
            <br />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso final - Agregar artículo al stock entrante</h4>
            {detallesArticuloStock.map((articulo, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={quitarCampoArticulo}>X</p>
                <h4>Artículo {index + 1}</h4>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
                  <InputComponent disabled={false} placeHolder='Filtrar artículo...' onInputClick={() => setModalBusquedaArticulo(true)} selectedProduct={detallesArticuloStock[index].articuloVenta?.nombre ?? ''} />
                  {modalBusquedaArticulo && <ModalFlotanteRecomendacionesArticulo datosOmitidos={nombresArticulos} onCloseModal={handleModalClose} onSelectArticuloVenta={(articulo) => { handleArticuloChange(articulo, index); handleModalClose(); }} />}
                </div>
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
                <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={detallesArticuloStock[index].articuloVenta?.medida?.nombre ?? detallesArticuloStock[index]?.medida?.nombre ?? ''} />
                {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={detallesArticuloStock[index]?.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaArticulo(medida, index); handleModalClose(); }} />}

                <div className="inputBox">
                  <input type="number" required={true} value={detallesArticuloStock[index]?.cantidad} onChange={(e) => handleCantidadArticulo(parseFloat(e.target.value), index)} />
                  <span>Cantidad de unidades</span>
                </div>

                <div className="inputBox">
                  <input type="number" required={true} value={detallesArticuloStock[index]?.costoUnitario ?? 0} onChange={(e) => almacenarSubTotalArticulo(parseFloat(e.target.value), index)} />
                  <span>Costo unitario ($)</span>
                </div>

              </div>
            ))}
            <button onClick={añadirCampoArticulo}>+ Añadir artículo</button>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={agregarStockEntrante}>Agregar stock entrante ✓</button>

            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar stock entrante &mdash;</h2>
      <Toaster />
      {renderStep()}
    </div >
  )
}

export default AgregarStockEntrante
