import { useEffect, useState } from 'react';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { Imagenes } from '../../types/Productos/Imagenes';
import { Toaster, toast } from 'sonner'
import './editarArticuloVenta.css'
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import '../../styles/modalCrud.css'
import InputComponent from '../InputFiltroComponent';
import { Categoria } from '../../types/Ingredientes/Categoria';
import { Medida } from '../../types/Ingredientes/Medida';
import ModalFlotanteRecomendacionesCategoria from '../../hooks/ModalFlotanteFiltroCategorias';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesSubcategoria from '../../hooks/ModalFlotanteFiltroSubcategorias';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';

interface EditarArticuloVentaProps {
  articuloOriginal: ArticuloVenta;
  onCloseModal: () => void;
}

const EditarArticuloVenta: React.FC<EditarArticuloVentaProps> = ({ articuloOriginal, onCloseModal }) => {
  const [imagenesMuestra, setImagenesMuestra] = useState<Imagenes[]>(articuloOriginal.imagenes);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<Imagenes[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [categoria, setCategoria] = useState<Categoria>(articuloOriginal.categoria);
  const [subcategoria, setSubcategoria] = useState<Subcategoria>(articuloOriginal.subcategoria);
  const [precioVenta, setPrecio] = useState(articuloOriginal.precioVenta);
  const [nombre, setNombre] = useState(articuloOriginal.nombre);
  const [medida, setMedida] = useState<Medida>(articuloOriginal.medida);
  const [cantidad, setCantidad] = useState(articuloOriginal.cantidadMedida);


  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    let imagenNueva = new Imagenes();
    imagenNueva.index = imagenes.length;
    setImagenes([...imagenes, imagenNueva]);
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

  const handleEliminarImagen = (index: number) => {
    const nuevasImagenes = [...imagenesMuestra];
    const imagenEliminada = nuevasImagenes.splice(index, 1)[0];
    setImagenesMuestra(nuevasImagenes);
    setImagenesEliminadas([...imagenesEliminadas, imagenEliminada]);
  };

  const [modalBusquedaCategoria, setModalBusquedaCategoria] = useState<boolean>(false);
  const [modalBusquedasubcategoria, setModalBusquedasubcategoria] = useState<boolean>(false);
  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaCategoria(false);
    setModalBusquedaMedida(false);
    setModalBusquedaMedida(false);
  };

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

  function editarArticuloVenta() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!cantidad || cantidad === 0) {
      toast.error("Por favor, es necesaria la cantidad");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesaria la medida");
      return;
    } else if (!precioVenta || precioVenta === 0) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!categoria) {
      toast.error("Por favor, es necesario la categoria");
      return;
    } else if (!subcategoria) {
      toast.error("Por favor, es necesario la subcategoria");
      return;
    } else if (imagenes.length === 0 && imagenesMuestra.length === 0) {
      toast.error("Por favor, es necesario una imagen");
      return;
    }

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    const articuloActualizado: ArticuloVenta = {
      ...articuloOriginal,
      nombre,
      precioVenta,
      categoria,
      cantidadMedida: cantidad,
      medida,
      subcategoria
    };

    articuloActualizado.sucursales = sucursalesElegidas;

    articuloActualizado.borrado = 'NO';

    toast.promise(ArticuloVentaService.updateArticulo(articuloActualizado, imagenes, imagenesEliminadas), {
      loading: 'Editando articulo...',
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

    if (imagenes.length === 0) {
      toast.info('No se añadieron imagenes al articulo');
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenesMuestra.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagenesMuestra.length - 1 : prevIndex - 1
    );
  };

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateAndNextStep = () => {


    if (!nombre || !nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/)) {
      toast.error("Por favor, es necesario el nombre del articulo");
      return;
    } else if (!precioVenta || precioVenta == 0) {
      toast.error("Por favor, es necesario el precio de venta del articulo válido");
      return;
    } else if (!categoria) {
      toast.error("Por favor, es necesario el tipo");
      return;
    } else if (!subcategoria) {
      toast.error("Por favor, es necesaria la subcategoría");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesaria la medida");
      return;
    } else if (!cantidad || cantidad == 0) {
      toast.error("Por favor, es necesaria una cantidad de la medida del artículo válida");
      return;
    } else {
      nextStep();
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Paso 1 - Datos</h4>

            <div className="inputBox">
              <input type="text" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre del articulo</span>
              <div className="error-message">El nombre debe contener letras y espacios.</div>

            </div>

            <div className="inputBox">
              <input type="text" required={true} pattern="\d*" value={precioVenta || ''} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
              <span>Precio de venta ($)</span>
              <div className="error-message">El precio de venta solo debe contener números.</div>

            </div>

            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Categoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria?.nombre ?? ''} />
              {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria datosOmitidos={categoria?.nombre} onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Subcategoría:</label>

              <InputComponent disabled={false} placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedasubcategoria(true)} selectedProduct={subcategoria?.nombre ?? ''} />
              {modalBusquedasubcategoria && <ModalFlotanteRecomendacionesSubcategoria datosOmitidos={subcategoria?.nombre} onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { setSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Unidad de medida de venta:</label>

              <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={medida?.nombre ?? ''} />
              {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}
            </div>
            <div className="inputBox">
              <input type="text" required={true} pattern="\d*" value={cantidad || ''} onChange={(e) => { setCantidad(parseFloat(e.target.value)) }} />
              <span>Cantidad de la medida de venta</span>
              <div className="error-message">El precio de venta solo debe contener números.</div>

            </div>

            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={validateAndNextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso final - Imagenes</h4>
            <div className="slider-container">
              <button onClick={prevImage} className="slider-button prev">◀</button>
              <div className='imagenes-wrapper'>
                {imagenesMuestra.map((imagen, index) => (
                  <div key={index} className={`imagen-muestra ${index === currentIndex ? 'active' : ''}`}>
                    <p className='cierre-ingrediente' onClick={() => handleEliminarImagen(index)}>X</p>
                    <label style={{ fontSize: '20px' }}>_imagenes asociadas</label>

                    {imagen && (
                      <img

                        src={imagen.ruta}
                        alt={`Imagen ${index}`}
                      />
                    )}
                  </div>

                ))}
                <button onClick={nextImage} className="slider-button next">▶</button>
              </div>
            </div>

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
            <br />
            <button onClick={añadirCampoImagen}>Añadir imagen</button>
            <br />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              {empresa && empresa.id > 0 ? (
                <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
              ) : (
                <button className='btn-accion-completar' onClick={editarArticuloVenta}>Editar articulo ✓</button>
              )}
            </div >
          </>
        );
      case 3:
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
              <button className='btn-accion-completar' onClick={editarArticuloVenta}>Editar artículo ✓</button>
            </div>
          </>
        );
    }
  }


  return (
    <div className="modal-info">
      <h2>&mdash; Editar artículo &mdash;</h2>
      <Toaster />
      {renderStep()}
    </div >
  );
}


export default EditarArticuloVenta
