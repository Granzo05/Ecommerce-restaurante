import { useState } from 'react';
import { Imagenes } from '../../types/Productos/Imagenes';
import { Toaster, toast } from 'sonner'
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import '../../styles/inputLabel.css'
import InputComponent from '../InputFiltroComponent';
import { Categoria } from '../../types/Ingredientes/Categoria';
import { Medida } from '../../types/Ingredientes/Medida';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesCategoria from '../../hooks/ModalFlotanteFiltroCategorias';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import ModalFlotanteRecomendacionesSubcategoria from '../../hooks/ModalFlotanteFiltroSubcategorias';
import { StockArticuloVenta } from '../../types/Stock/StockArticuloVenta';
import { StockArticuloVentaService } from '../../services/StockArticulosService';

function AgregarArticuloVenta() {
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [precioStock, setPrecioStock] = useState(0);
  const [medidaStock, setMedidaStock] = useState<Medida>(new Medida());

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

      if (selectIndex > 0) {
        setSelectIndex(prevIndex => prevIndex - 1);
      }
    }
  };

  const [categoria, setCategoria] = useState<Categoria>(new Categoria());
  const [subcategoria, setSubcategoria] = useState<Subcategoria>(new Subcategoria());
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [medida, setMedida] = useState<Medida>(new Medida);
  const [cantidadMedida, setCantidadMedida] = useState(0);

  async function agregarArticulo() {
    if (imagenes.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    } else if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!precio) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!categoria) {
      toast.error("Por favor, es necesario el tipo");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesaria la medida");
      return;
    } else if (!cantidadMedida) {
      toast.error("Por favor, es necesaria la cantidad de la medida del artículo");
      return;
    }

    if (cantidadMinima > 0 || cantidadActual > 0 || cantidadMaxima > 0 || medidaStock.nombre.length > 0 || precioStock > 0) {
      if (!cantidadMinima || cantidadMinima < 0) {
        toast.error("Por favor, los datos con opcionales en conjunto, es necesaria la cantidad mínima");
        return;
      } else if (!cantidadMaxima || cantidadMaxima < 0) {
        toast.error("Por favor, los datos con opcionales en conjunto, es necesaria la cantidad máxima");
        return;
      } else if (!cantidadActual || cantidadActual < 0) {
        toast.error("Por favor, los datos con opcionales en conjunto, es necesaria la cantidad actual");
        return;
      } else if (cantidadActual > cantidadMaxima) {
        toast.error("Por favor, los datos con opcionales en conjunto, la cantidad actual no puede ser mayor a la maxima");
        return;
      } else if (cantidadActual < cantidadMinima) {
        toast.error("Por favor, los datos con opcionales en conjunto, la cantidad actual no puede ser menor a la minima");
        return;
      } else if (!medidaStock) {
        toast.error("Por favor, los datos con opcionales en conjunto, es necesario la medida");
        return;
      } else if (!precioStock || precioStock < 0) {
        toast.error("Por favor, los datos con opcionales en conjunto, es necesario el precio del ingrediente");
        return;
      } else if (cantidadMaxima < cantidadMinima) {
        toast.error("Por favor, los datos con opcionales en conjunto, la cantidad mínima no puede ser mayor a la máxima");
        return;
      }
    }

    const articulo: ArticuloVenta = new ArticuloVenta();

    articulo.nombre = nombre;
    articulo.categoria = categoria;
    articulo.precioVenta = precio;
    articulo.medida = medida;
    articulo.cantidadMedida = cantidadMedida;
    articulo.borrado = 'NO';
    articulo.subcategoria = subcategoria;

    const stockArticuloVenta: StockArticuloVenta = new StockArticuloVenta();

    stockArticuloVenta.cantidadActual = cantidadActual;
    stockArticuloVenta.cantidadMinima = cantidadMinima;
    stockArticuloVenta.cantidadMaxima = cantidadMaxima;
    stockArticuloVenta.precioCompra = precioStock;

    stockArticuloVenta.medida = medidaStock;

    let articuloStock: ArticuloVenta = new ArticuloVenta();
    articuloStock.nombre = articulo.nombre;

    stockArticuloVenta.articuloVenta = articuloStock;

    toast.promise(ArticuloVentaService.createArticulo(articulo, imagenes), {
      loading: 'Creando articulo...',
      success: (message) => {
        StockArticuloVentaService.createStock(stockArticuloVenta);
        return message;
      },
      error: (message) => {
        return message;
      },
    });

  }

  // Modal flotante de ingrediente
  const [modalBusquedaCategoria, setModalBusquedaCategoria] = useState<boolean>(false);
  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);
  const [modalBusquedaSubcategoria, setModalBusquedaSubcategoria] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaCategoria(false)
    setModalBusquedaMedida(false)
    setModalBusquedaSubcategoria(false)
  };

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
              <hr />
              <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre del articulo</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} />
              <span>Precio ($)</span>
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Categoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria?.nombre ?? ''} />
              {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria datosOmitidos={categoria?.nombre} onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Subcategoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedaSubcategoria(true)} selectedProduct={subcategoria?.nombre ?? ''} />
              {modalBusquedaSubcategoria && <ModalFlotanteRecomendacionesSubcategoria datosOmitidos={subcategoria?.nombre} onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { setSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={medida?.nombre ?? ''} />
              {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={cantidadMedida} onChange={(e) => setCantidadMedida(parseFloat(e.target.value))} />
              <span>Cantidad de la medida</span>
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso final - Imagen</h4>
            <div >
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
            <br />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Agregar stock ⭢</button>
              <button className='btn-accion-completar' onClick={agregarArticulo}>Agregar artículo ✓</button>

            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso opcional - Stock</h4>
            <label>
              <div className="inputBox">
                <input type="number" required value={cantidadMinima} onChange={(e) => { setCantidadMinima(parseFloat(e.target.value)) }} />
                <span>Cantidad mínima del articulo (opcional)</span>
              </div>
            </label>
            <label>
              <div className="inputBox">
                <input type="number" required value={cantidadMaxima} onChange={(e) => { setCantidadMaxima(parseFloat(e.target.value)) }} />
                <span>Cantidad máxima del articulo (opcional)</span>
              </div>
            </label>
            <label>
              <div className="inputBox">
                <input type="number" required value={cantidadActual} onChange={(e) => { setCantidadActual(parseFloat(e.target.value)) }} />
                <span>Cantidad actual del articulo (opcional)</span>
              </div>
            </label>
            <label>
              <div className="inputBox">
                <input type="number" required value={precioStock} onChange={(e) => { setPrecioStock(parseFloat(e.target.value)) }} />
                <span>Costo por unidad ($) (opcional)</span>
              </div>
            </label>
            <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={medidaStock.nombre ?? ''} />
            {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={medidaStock?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedidaStock(medida); handleModalClose(); }} />}
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={agregarArticulo}>Agregar artículo ✓</button>

            </div>
          </>
        );
    }

  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar artículo para venta &mdash;</h2>
      <Toaster />
      {renderStep()}

    </div >
  )
}

export default AgregarArticuloVenta
