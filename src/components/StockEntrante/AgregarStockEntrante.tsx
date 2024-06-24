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
  const [fecha, setFecha] = useState<Date>();

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
    if (cantidad !== null && cantidad !== undefined) {
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
    if (costo !== null && costo !== undefined) {
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
    if (cantidad !== null && cantidad !== undefined) {
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
    if (costo !== null && costo !== undefined) {
      setDetallesArticuloStock(prevState => {
        const newState = [...prevState];
        newState[index].costoUnitario = costo;
        return newState;
      });
    }
  };

  const añadirCampoIngrediente = () => {
    setDetallesIngredientesStock(prevState => {
      const newState = [...prevState, { id: 0, cantidad: parseInt(''), costoUnitario: parseInt(''), subtotal: 0, medida: new Medida(), ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO', modificarPrecio: false }];
      return newState;
    });
  };

  const añadirCampoArticulo = () => {
    setDetallesArticuloStock(prevState => {
      const newState = [...prevState, { id: 0, cantidad: parseInt(''), costoUnitario: parseInt(''), subtotal: 0, medida: new Medida(), ingrediente: new Ingrediente(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO', modificarPrecio: false }];
      return newState;
    });
  };

  const quitarCampoIngrediente = (nombreIngrediente: string) => {
    const nuevosNombres = nombresIngredientes.filter(nombre => nombre !== nombreIngrediente);
    setNombresIngredientes(nuevosNombres);

    setDetallesIngredientesStock(prevState => {
      const newState = prevState.slice(0, -1);
      return newState;
    });
  };

  const quitarCampoArticulo = (nombreArticulo: string) => {
    const nuevosNombres = nombresArticulos.filter(nombre => nombre !== nombreArticulo);
    setNombresIngredientes(nuevosNombres);

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

  function handleRecomendarMedidaIngrediente(ingrediente: Ingrediente, detalle: DetalleStock[], index: number) {
    if (ingrediente && ingrediente.stockIngrediente?.medida?.nombre) {
      detalle[index].medida = ingrediente.stockIngrediente.medida;
    }
  }

  function handleRecomendarMedidaArticulo(articulo: ArticuloVenta, detalle: DetalleStock[], index: number) {
    if (articulo && articulo.stockArticuloVenta?.medida?.nombre) {
      detalle[index].medida = articulo.stockArticuloVenta.medida;
    }
  }

  const [checkboxStatesIngredientes, setCheckboxStatesIngredientes] = useState(detallesIngredienteStock.map(() => false));
  const [checkboxStatesArticulos, setCheckboxStatesArticulos] = useState(detallesIngredienteStock.map(() => false));

  const handleCheckboxChangeIngrediente = (index: number) => {
    const newCheckboxStates = [...checkboxStatesIngredientes];
    newCheckboxStates[index] = !newCheckboxStates[index];

    detallesIngredienteStock[index].modificarPrecio = newCheckboxStates[index];
    setCheckboxStatesIngredientes(newCheckboxStates);
  };

  const handleCheckboxChangeArticulos = (index: number) => {
    const newCheckboxStates = [...checkboxStatesArticulos];
    newCheckboxStates[index] = !newCheckboxStates[index];

    detallesArticuloStock[index].modificarPrecio = newCheckboxStates[index];

    setCheckboxStatesArticulos(newCheckboxStates);
  };

  const [isLoading, setIsLoading] = useState(false);

  async function agregarStockEntrante() {
    const hoy = new Date();

    if (!fecha) {
      toast.error("Por favor, la fecha es necesaria");
      return;
    }

    const fechaIngresada = new Date(fecha);

    if (fechaIngresada <= hoy) {
      toast.error("Por favor, la fecha debe ser posterior a la fecha actual");
      return;
    }

    if ((!detallesIngredienteStock.length || !detallesIngredienteStock[0].ingrediente?.nombre) &&
      (!detallesArticuloStock.length || !detallesArticuloStock[0].articuloVenta?.nombre)) {
      toast.error("Por favor, es necesario asignar un producto de venta o un ingrediente");
      return;
    }

    const stockEntrante: StockEntrante = new StockEntrante();
    setIsLoading(true);

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

    toast.promise(
      StockEntranteService.createStock(stockEntrante),
      {
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
        finally: () => {
          setIsLoading(false);
        },
        duration: 5000,
      },
    );

  }

  //SEPARAR EN PASOS
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateAndNextStep = () => {

    const hoy = new Date();
    if (fecha) {
      const fechaIngresada = new Date(fecha);

      const fechaObj = new Date(fecha);

      // Verificar que la fecha sea válida
      if (isNaN(fechaObj.getTime())) {
        toast.error("La fecha no es válida");
        return;
      }

      else if (fechaIngresada <= hoy) {
        toast.error("Por favor, la fecha es necesaria y debe ser posterior a la fecha actual");
        return;
      } else {
        nextStep();
      }
    } else {
      toast.error("Por favor, la fecha es necesaria");
      return;
    }
  }

  const validateAndNextStep2 = () => {

    for (let i = 0; i < detallesIngredienteStock.length; i++) {
      const ingrediente = detallesIngredienteStock[i].ingrediente;
      const medida = detallesIngredienteStock[i].medida;
      const cantidad = detallesIngredienteStock[i].cantidad;
      const costoUnitario = detallesIngredienteStock[i].costoUnitario;

      if (!ingrediente) {
        toast.info(`Por favor, el ingrediente ${i + 1} debe contener un ingrediente`);
        return;
      } else if (!medida) {
        toast.info(`Por favor, el ingrediente ${i + 1} debe contener una unidad de medida`);
        return;
      } else if (!cantidad || (cantidad == 0)) {
        toast.info(`Por favor, el ingrediente ${i + 1} debe contener una cantidad válida`);
        return;
      } else if (!costoUnitario || (costoUnitario == 0)) {
        toast.info(`Por favor, el ingrediente ${i + 1} debe contener un costo válido`);
        return;
      }
    }

    if (detallesIngredienteStock) {
      nextStep();
    }
  }

  const validateAndNextStep3 = () => {

    for (let i = 0; i < detallesArticuloStock.length; i++) {
      const articuloVenta = detallesArticuloStock[i].articuloVenta;
      const medida = detallesArticuloStock[i].medida;
      const cantidad = detallesArticuloStock[i].cantidad;
      const costoUnitario = detallesArticuloStock[i].costoUnitario;

      if (!articuloVenta) {
        toast.info(`Por favor, el articulo ${i + 1} debe contener un articulo`);
        return;
      } else if (!medida) {
        toast.info(`Por favor, el articulo ${i + 1} debe contener una unidad de medida`);
        return;
      } else if (!cantidad || (cantidad == 0)) {
        toast.info(`Por favor, el articulo ${i + 1} debe contener una cantidad válida`);
        return;
      } else if (!costoUnitario || (costoUnitario == 0)) {
        toast.info(`Por favor, el articulo ${i + 1} debe contener un costo válido`);
        return;
      }
    }

    if (detallesIngredienteStock) {
      agregarStockEntrante();
    }
  }

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
              <button className='btn-accion-adelante' onClick={validateAndNextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Agregar ingrediente al stock entrante</h4>
            {detallesIngredienteStock.map((detalle, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoIngrediente(detalle.ingrediente.nombre)}>X</p>
                <h4>Ingrediente {index + 1}</h4>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
                  <InputComponent disabled={false} placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={detalle.ingrediente?.nombre ?? ''} />
                  {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientes datosOmitidos={nombresIngredientes} onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { handleIngredienteChange(ingrediente, index); handleRecomendarMedidaIngrediente(ingrediente, detallesIngredienteStock, index); handleModalClose(); }} />}
                </div>
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
                <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={detalle.medida?.nombre} />
                {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={detalle.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaIngrediente(medida, index); handleModalClose(); }} />}

                <div className="inputBox">
                  <input type="number" required={true} pattern="^[1-9]\d*$" value={detalle.cantidad} onChange={(e) => handleCantidadIngrediente(parseFloat(e.target.value), index)} />
                  <span>Cantidad de unidades</span>
                  <div className="error-message">La cantidad solo debe contener números.</div>

                </div>
                <div className="inputBox">
                  <input type="number" required={true} pattern="^[1-9]\d*$" value={detallesIngredienteStock[index]?.costoUnitario} onChange={(e) => almacenarSubTotalIngrediente(parseFloat(e.target.value), index)} />
                  <span>Costo unitario ($)</span>
                  <div className="error-message">El costo por unidad solo debe contener números.</div>
                </div>
                <div className="inputBox">
                  <label htmlFor={`costo-${index}`}>Asignar el costo al precio del stock actual</label>
                  <input
                    type="checkbox"
                    name={`costo-${index}`}
                    id={`costo-${index}`}
                    checked={checkboxStatesIngredientes[index]}
                    onChange={() => handleCheckboxChangeIngrediente(index)}
                  />
                </div>
              </div>
            ))}
            <button onClick={añadirCampoIngrediente}>+ Añadir ingrediente</button>
            <br />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={validateAndNextStep2}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso final - Agregar artículo al stock entrante</h4>
            {detallesArticuloStock.map((detalle, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoArticulo(detalle.articuloVenta.nombre)}>X</p>
                <h4>Artículo {index + 1}</h4>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
                  <InputComponent disabled={false} placeHolder='Filtrar artículo...' onInputClick={() => setModalBusquedaArticulo(true)} selectedProduct={detalle.articuloVenta?.nombre ?? ''} />
                  {modalBusquedaArticulo && <ModalFlotanteRecomendacionesArticulo datosOmitidos={nombresArticulos} onCloseModal={handleModalClose} onSelectArticuloVenta={(articulo) => { handleArticuloChange(articulo, index); handleRecomendarMedidaArticulo(articulo, detallesArticuloStock, index); handleModalClose(); }} />}
                </div>
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
                <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={detalle.medida?.nombre} />
                {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={detalle.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaArticulo(medida, index); handleModalClose(); }} />}

                <div className="inputBox">
                  <input type="number" required={true} value={detallesArticuloStock[index]?.cantidad} onChange={(e) => handleCantidadArticulo(parseFloat(e.target.value), index)} />
                  <span>Cantidad de unidades</span>
                </div>

                <div className="inputBox">
                  <input type="number" required={true} value={detallesArticuloStock[index]?.costoUnitario ?? 0} onChange={(e) => almacenarSubTotalArticulo(parseFloat(e.target.value), index)} />
                  <span>Costo unitario ($)</span>
                </div>
                <div className="inputBox">
                  <label htmlFor={`costo-${index}`}>Asignar el costo al precio del stock actual</label>
                  <input
                    type="checkbox"
                    name={`costo-${index}`}
                    id={`costo-${index}`}
                    checked={checkboxStatesArticulos[index]}
                    onChange={() => handleCheckboxChangeArticulos(index)}
                  />
                </div>
              </div>
            ))}
            <button onClick={añadirCampoArticulo}>+ Añadir artículo</button>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={validateAndNextStep3} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Agregar stock entrante ✓'}
              </button>
            </div >
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
