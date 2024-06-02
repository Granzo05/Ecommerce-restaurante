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

function AgregarArticuloVenta() {
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

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
  const [cantidad, setCantidad] = useState(0);

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
    } else if (!cantidad) {
      toast.error("Por favor, es necesaria la cantidad");
      return;
    }

    const articulo: ArticuloVenta = new ArticuloVenta();

    articulo.nombre = nombre;
    articulo.categoria = categoria;
    articulo.precioVenta = precio;
    articulo.medida = medida;
    articulo.cantidadMedida = cantidad;
    articulo.borrado = 'NO';
    articulo.subcategoria = subcategoria;

    toast.promise(ArticuloVentaService.createArticulo(articulo, imagenes), {
      loading: 'Creando articulo...',
      success: (message) => {
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
              <input type="text" required={true} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre del articulo</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => setPrecio(parseFloat(e.target.value))} />
              <span>Precio ($)</span>
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Categoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria.nombre ?? ''} />
              {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Subcategoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedaSubcategoria(true)} selectedProduct={subcategoria.nombre ?? ''} />
              {modalBusquedaSubcategoria && <ModalFlotanteRecomendacionesSubcategoria onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { setSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={medida.nombre ?? ''} />
              {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => setCantidad(parseFloat(e.target.value))} />
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
                  <p className='cierre-ingrediente' onClick={quitarCampoImagen}>X</p>
                  <h4 style={{fontSize: '18px'}}>Imagen {index+1}</h4>
                  <br />
                  <input
                    type="file"
                    accept="image/*"
                    maxLength={10048576}
                    onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
                  />

                </div>
              ))}

            </div>
            <button onClick={añadirCampoImagen}>Añadir imagen</button>
            <br />
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
