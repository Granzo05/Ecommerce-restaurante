import { useEffect, useState } from 'react';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { toast, Toaster } from 'sonner';
import InputComponent from '../InputFiltroComponent';
import '../../styles/modalCrud.css'
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesArticulo from '../../hooks/ModalFlotanteFiltroArticuloVenta';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';
import { DetallePromocion } from '../../types/Productos/DetallePromocion';
import { Medida } from '../../types/Ingredientes/Medida';
import { Promocion } from '../../types/Productos/Promocion';
import { PromocionService } from '../../services/PromocionService';
import ModalFlotanteRecomendacionesArticuloMenu from '../../hooks/ModalFlotanteFiltroArticuloMenu';
import { Imagenes } from '../../types/Productos/Imagenes';
import { formatearFechaYYYYMMDD, formatearFechaYYYYMMDDHHMM } from '../../utils/global_variables/functions';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';

interface AgregarPromocionProps {
  onCloseModal: () => void;
}


const AgregarPromocion: React.FC<AgregarPromocionProps> = ({ onCloseModal }) => {
  const [fechaDesde, setFechaDesde] = useState(new Date());
  const [fechaHasta, setFechaHasta] = useState(new Date());
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [precioSugerido, setPrecioSugerido] = useState<number>(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(precioSugerido);

  // Aca almaceno los detalles para el stock
  const [detallesArticuloMenu, setDetallesArticulosMenu] = useState<DetallePromocion[]>([])
  const [detallesArticuloVenta, setDetallesArticuloVenta] = useState<DetallePromocion[]>([])

  const [nombresArticulos, setNombresArticulos] = useState<string[]>([]);
  const [nombresMenus, setNombresMenus] = useState<string[]>([]);

  const handleDescuentoChange = (descuento: number) => {
    const newTotal = (1 - descuento / 100) * precioSugerido;
    setDescuento(descuento);
    setTotal(newTotal);
  };

  const handleTotalChange = (total: number) => {
    const newDescuento = ((precioSugerido - total) / precioSugerido) * 100;
    setTotal(total);
    setDescuento(parseFloat(newDescuento.toFixed(2)));
  };


  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  let [selectIndexImagenes, setSelectIndexImagenes] = useState<number>(0);

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    setImagenes([...imagenes, { index: imagenes.length, file: null } as Imagenes]);
  };

  const quitarCampoImagen = () => {
    if (imagenes.length > 0) {
      const nuevasImagenes = [...imagenes];
      nuevasImagenes.pop();
      setImagenes(nuevasImagenes);

      if (selectIndexImagenes > 0) {
        setSelectIndexImagenes(prevIndex => prevIndex - 1);
      }
    } else {
      const nuevasImagenes = [...imagenes];
      nuevasImagenes.pop();
      setImagenes(nuevasImagenes);
      setSelectIndexImagenes(0);
    }
  };

  // Almacenaje de cada detalle por articuloMenu
  const handleArticuloMenuChange = (articuloMenu: ArticuloMenu, index: number) => {
    setDetallesArticulosMenu(prevState => {
      const newState = [...prevState];
      newState[index].articuloMenu = articuloMenu;

      const nuevosNombresArticulos = [...nombresArticulos];
      nuevosNombresArticulos[index] = articuloMenu.nombre;
      setNombresMenus(nuevosNombresArticulos);

      return newState;
    });
  };

  const handleCantidadArticuloMenu = (cantidad: number, index: number) => {
    if (cantidad) {
      setDetallesArticulosMenu(prevState => {
        const newState = [...prevState];
        newState[index].cantidad = cantidad;
        return newState;
      });
    }
  };

  const handleMedidaArticuloMenu = (medida: Medida, index: number) => {
    if (medida) {
      setDetallesArticulosMenu(prevState => {
        const newState = [...prevState];
        newState[index].medida = medida;
        return newState;
      });
    }
  };

  const handleArticuloChange = (articulo: ArticuloVenta, index: number) => {
    setDetallesArticuloVenta(prevState => {
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
      setDetallesArticuloVenta(prevState => {
        const newState = [...prevState];
        newState[index].cantidad = cantidad;
        return newState;
      });
    }
  };

  const handleMedidaArticulo = (medida: Medida, index: number) => {
    if (medida) {
      setDetallesArticuloVenta(prevState => {
        const newState = [...prevState];
        newState[index].medida = medida;
        return newState;
      });
    }
  };

  const añadirCampoArticuloMenu = () => {
    setDetallesArticulosMenu(prevState => {
      const newState = [...prevState, { id: 0, cantidad: 0, costoUnitario: 0, subtotal: 0, medida: new Medida(), articuloMenu: new ArticuloMenu(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }];
      return newState;
    });
  };

  const añadirCampoArticulo = () => {
    setDetallesArticuloVenta(prevState => {
      const newState = [...prevState, { id: 0, cantidad: 0, costoUnitario: 0, subtotal: 0, medida: new Medida(), articuloMenu: new ArticuloMenu(), articuloVenta: new ArticuloVenta(), stockEntrante: null, borrado: 'NO' }];
      return newState;
    });
  };

  const quitarCampoArticuloMenu = (nombreArticuloMenu: string) => {
    const nuevosNombres = nombresArticulos.filter(nombre => nombre !== nombreArticuloMenu);
    setNombresMenus(nuevosNombres);

    setDetallesArticulosMenu(prevState => {
      const newState = prevState.slice(0, -1);
      return newState;
    });
  };

  const quitarCampoArticulo = (nombreArticulo: string) => {
    const nuevosNombres = nombresArticulos.filter(nombre => nombre !== nombreArticulo);
    setNombresArticulos(nuevosNombres);

    setDetallesArticuloVenta(prevState => {
      const newState = prevState.slice(0, -1);
      return newState;
    });
  };

  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);
  const [modalBusquedaArticulo, setModalBusquedaArticulo] = useState<boolean>(false);
  const [modalBusquedaArticuloMenu, setModalBusquedaArticuloMenu] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaMedida(false)
    setModalBusquedaArticulo(false)
    setModalBusquedaArticuloMenu(false)
  };

  function calcularCostos() {
    let precioRecomendado: number = 0;
    console.log(detallesArticuloMenu)
    detallesArticuloMenu.forEach(detalle => {
      if (detalle?.articuloMenu.nombre.length > 0) {
        precioRecomendado += detalle?.articuloMenu?.precioVenta * detalle?.cantidad;
      }
    });
    console.log(detallesArticuloVenta)

    detallesArticuloVenta.forEach(detalle => {
      if (detalle?.articuloVenta.nombre.length > 0) {
        precioRecomendado += detalle?.articuloVenta?.precioVenta * detalle?.cantidad;
      }
    });

    setPrecioSugerido(precioRecomendado);
  }

  const [empresa] = useState<Empresa | null>(() => {
    const empresaString = localStorage.getItem('empresa');

    return empresaString ? (JSON.parse(empresaString) as Empresa) : null;
  });

  const [idsSucursalesElegidas, setIdsSucursalesElegidas] = useState<Set<number>>(new Set<number>());
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    SucursalService.getSucursales()
      .then(data => {
        setSucursales(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleSucursalesElegidas = (sucursalId: number) => {
    const updatedSelectedSucursales = new Set(idsSucursalesElegidas);
    if (updatedSelectedSucursales.has(sucursalId)) {
      updatedSelectedSucursales.delete(sucursalId);
    } else {
      updatedSelectedSucursales.add(sucursalId);
    }
    setIdsSucursalesElegidas(updatedSelectedSucursales);
  };

  const marcarSucursales = () => {
    setIdsSucursalesElegidas(new Set(sucursales.map(sucursal => sucursal.id)));
  };

  const desmarcarSucursales = () => {
    setIdsSucursalesElegidas(new Set());
  };

  async function agregarStockEntrante() {
    const hoy = new Date();

    fechaDesde.setDate(fechaDesde.getDate() + 1);
    fechaHasta.setDate(fechaHasta.getDate() + 1);

    if (!fechaDesde) {
      toast.error("Por favor, la fecha de inicio es necesaria");
      return;
    } else if (!fechaHasta) {
      toast.error("Por favor, la fecha de finalización es necesaria");
      return;
    } else if (new Date(fechaDesde) <= hoy || new Date(fechaHasta) <= hoy) {
      toast.error("Por favor, las fechas debe ser posterior a la fecha actual");
      return;
    } else if (new Date(fechaHasta) <= new Date(fechaDesde)) {
      toast.error("Por favor, las fecha de inicio no puede ser posterior a la de finalización");
      return;
    } else if ((!detallesArticuloMenu[0].articuloMenu?.nombre.length && !detallesArticuloVenta[0].articuloVenta?.nombre)) {
      toast.error("Por favor, es necesario asignar un producto de venta o un menú");
      return;
    } else if (imagenes.length === 0) {
      toast.error("No se asignó ninguna imagen");
      return;
    } else if (!total) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!descripcion) {
      toast.error("Por favor, es necesaria la descripción");
      return;
    }

    const promocion: Promocion = new Promocion();

    promocion.fechaDesde = fechaDesde;
    promocion.fechaHasta = fechaHasta;

    promocion.borrado = 'NO';

    const detallesPromocion: DetallePromocion[] = [];

    detallesArticuloMenu.forEach(detalle => {
      if (detalle.articuloMenu?.nombre && detalle.articuloMenu?.nombre.length > 2) detallesPromocion.push(detalle);
    });

    detallesArticuloVenta.forEach(detalle => {
      if (detalle.articuloVenta?.nombre && detalle.articuloVenta?.nombre.length > 2) detallesPromocion.push(detalle);
    });

    promocion.detallesPromocion = detallesPromocion;

    promocion.precio = total;

    promocion.nombre = nombre;

    promocion.descripcion = descripcion;

    promocion.descuento = descuento;

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    promocion.sucursales = sucursalesElegidas;

    toast.promise(PromocionService.createPromocion(promocion, imagenes), {
      loading: 'Creando promoción...',
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

  useEffect(() => {
    calcularCostos();
  }, [step]);

  const nextStep = () => {
    if (step === 3) {
      calcularCostos();
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  

  const fechaActual = new Date();
  const fechaActualFormateada = formatearFechaYYYYMMDDHHMM(fechaActual);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Paso 1 - Datos</h4>
            <div className="inputBox">
              <input type="text" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+" required={true} value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <span>Nombre de la promoción</span>

              <div className="error-message">El nombre debe contener letras y espacios.</div>
            </div>
            <div className="inputBox">
              <input type="text" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+" required={true} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              <span>Descrición de la promoción</span>
              <div className="error-message">La descripción debe contener letras y espacios.</div>

            </div>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de inicio:</label>
              <input
                type="datetime-local"
                required={true}
                min={fechaActualFormateada}
                value={formatearFechaYYYYMMDDHHMM(fechaDesde)}
                onChange={(e) => { setFechaDesde(new Date(e.target.value)) }}
              />
              <div className="error-message" style={{marginTop: '70px'}}>La fecha de inicio debe ser válida, y mayor o igual a la actual.</div>

            </div>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de finalización:</label>
              <input
                type="datetime-local"
                required={true}
                value={formatearFechaYYYYMMDDHHMM(fechaHasta)}
                onChange={(e) => { setFechaHasta(new Date(e.target.value)) }}
              />
              <div className="error-message" style={{marginTop: '70px'}}>La fecha de finalización debe ser válida, y mayor o igual a la actual.</div>

            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Agregar menú a la promoción</h4>
            {detallesArticuloMenu.map((articuloMenu, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoArticuloMenu(articuloMenu.articuloMenu.nombre)}>X</p>
                <h4>Menú {index + 1}</h4>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Menú:</label>
                  <InputComponent disabled={false} placeHolder='Filtrar menú...' onInputClick={() => setModalBusquedaArticuloMenu(true)} selectedProduct={detallesArticuloMenu[index].articuloMenu?.nombre ?? ''} />
                  {modalBusquedaArticuloMenu && <ModalFlotanteRecomendacionesArticuloMenu datosOmitidos={nombresMenus} onCloseModal={handleModalClose} onSelectArticuloMenu={(articuloMenu) => { handleArticuloMenuChange(articuloMenu, index); handleModalClose(); }} />}
                </div>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
                  <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={detallesArticuloMenu[index]?.medida?.nombre ?? ''} />
                  {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={detallesArticuloMenu[index]?.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaArticuloMenu(medida, index); handleModalClose(); }} />}
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={articuloMenu.cantidad} onChange={(e) => handleCantidadArticuloMenu(parseFloat(e.target.value), index)} />
                  <span>Cantidad de unidades</span>
                </div>
              </div>
            ))}

            <button onClick={añadirCampoArticuloMenu}>+ Añadir menú</button>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso 3 - Agregar artículo a la promoción</h4>
            {detallesArticuloVenta.map((articulo, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoArticulo(articulo.articuloVenta.nombre)}>X</p>
                <h4>Artículo {index + 1}</h4>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Artículo:</label>
                  <InputComponent disabled={false} placeHolder='Filtrar artículo...' onInputClick={() => setModalBusquedaArticulo(true)} selectedProduct={detallesArticuloVenta[index].articuloVenta?.nombre ?? ''} />
                  {modalBusquedaArticulo && <ModalFlotanteRecomendacionesArticulo datosOmitidos={nombresArticulos} onCloseModal={handleModalClose} onSelectArticuloVenta={(articulo) => { handleArticuloChange(articulo, index); handleModalClose(); }} />}
                </div>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
                  <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={detallesArticuloVenta[index]?.medida?.nombre ?? ''} />
                  {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={detallesArticuloVenta[index]?.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaArticulo(medida, index); handleModalClose(); }} />}
                </div>
                <div className="inputBox">
                  <input type="number" required={true} onChange={(e) => handleCantidadArticulo(parseFloat(e.target.value), index)} />
                  <span>Cantidad de unidades</span>
                </div>
              </div>
            ))}
            <button onClick={añadirCampoArticulo}>+ Añadir artículo</button>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 4:
        return (
          <>
            <h4>Paso 4 - Imagen</h4>
            <div>
              {imagenes.map((imagen, index) => (
                <div key={index} className='inputBox'>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => quitarCampoImagen()}>X</p>
                  <h4 style={{ fontSize: '18px' }}>Imagen {index + 1}</h4>
                  <br />
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      id={`file-input-${index}`}
                      className="file-input"
                      onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
                    />
                    <label htmlFor={`file-input-${index}`} className="file-input-label">
                      {imagen.file ? (
                        <p>Archivo seleccionado: {imagen.file.name}</p>
                      ) : (
                        <p>Seleccionar un archivo</p>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={añadirCampoImagen}>Añadir imagen</button>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 5:
        return (
          <>
            <h4>Paso final - Precio</h4>
            <div>
              {precioSugerido !== undefined && precioSugerido > 0 ? (
                <>
                  <p>Precio de los artículos sin descuentos: ${precioSugerido.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <>
                    <div className="inputBox">
                      <input type="number" value={descuento} onChange={(e) => handleDescuentoChange(parseInt(e.target.value))} />
                      <span>% de descuento buscado</span>
                    </div>
                  </>

                  <div className="inputBox">
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      required={true}
                      value={total.toFixed(2)}
                      onChange={(e) => handleTotalChange(parseFloat(e.target.value))}
                    />
                    <span>Precio</span>
                  </div>
                </>
              ) : (
                <p>No hay productos asignados aún</p>
              )}
            </div>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              {empresa && empresa?.id > 0 ? (
                <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
              ) : (
                <button className='btn-accion-completar' onClick={agregarStockEntrante}>Agregar promoción ✓</button>
              )}
            </div>
          </>
        );
      case 6:
        return (
          <>
            <h4>Sucursales</h4>
            {sucursales && sucursales.map((sucursal, index) => (
              <div key={index}>
                <>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => desmarcarSucursales()}>Desmarcar todas</p>
                  <p className='cierre-ingrediente' onClick={() => marcarSucursales()}>Marcar todas</p>
                  <h4 style={{ fontSize: '18px' }}>Sucursal: {sucursal.nombre}</h4>
                  <input
                    type="checkbox"
                    value={sucursal.id}
                    checked={idsSucursalesElegidas.has(sucursal.id) || false}
                    onChange={() => handleSucursalesElegidas(sucursal.id)}
                  />
                  <label>{sucursal.nombre}</label>
                </>
              </div>
            ))}
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={agregarStockEntrante}>Agregar promoción ✓</button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar promoción &mdash;</h2>
      <Toaster />
      {renderStep()}
    </div >
  )
}

export default AgregarPromocion
