import { useState } from 'react';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { ImagenesProductoDTO } from '../../types/Productos/ImagenesProductoDTO';
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

interface EditarArticuloVentaProps {
  articuloOriginal: ArticuloVenta;
}

const EditarArticuloVenta: React.FC<EditarArticuloVentaProps> = ({ articuloOriginal }) => {
  const [imagenesMuestra, setImagenesMuestra] = useState<ImagenesProductoDTO[]>(articuloOriginal.imagenesDTO);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<ImagenesProductoDTO[]>([]);
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

    const articuloActualizado: ArticuloVenta = {
      ...articuloOriginal,
      nombre,
      precioVenta,
      categoria,
      cantidadMedida: cantidad,
      medida,
      subcategoria
    };

    articuloActualizado.borrado = 'NO';

    toast.promise(ArticuloVentaService.updateArticulo(articuloActualizado, imagenes, imagenesEliminadas), {
      loading: 'Editando articulo...',
      success: (message) => {
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

  return (
    <div className="modal-info">
      <h2>Editar artículo</h2>
      <Toaster />
      <div className="slider-container">
        <button onClick={prevImage} className="slider-button prev">◀</button>
        <div className='imagenes-wrapper'>
          {imagenesMuestra.map((imagen, index) => (
            <div key={index} className={`imagen-muestra ${index === currentIndex ? 'active' : ''}`}>
              <p className='cierre-ingrediente' onClick={() => handleEliminarImagen(index)}>X</p>
              <label style={{ fontSize: '20px' }}>- Imagen {index + 1}</label>

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
          <p className='cierre-ingrediente' onClick={quitarCampoImagen}>X</p>
          <input
            type="file"
            accept="image/*"
            maxLength={10048576}
            onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
          />
        </div>
      ))}
      <br />
      <button onClick={añadirCampoImagen}>Añadir imagen</button>
      <div>
        <div className="inputBox">
          <hr />
          <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
          <span>Nombre del articulo</span>
        </div>

        <div className="inputBox">
          <input type="text" required={true} value={precioVenta | 0} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
          <span>Precio del articulo</span>
        </div>
        <div className="inputBox">
          <input type="text" required={true} value={cantidad | 0} onChange={(e) => { setCantidad(parseFloat(e.target.value)) }} />
          <span>Cantidad</span>
        </div>
        <div className="input-filtrado">
          <InputComponent placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria?.nombre ?? ''} />
          {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
        </div>
        <div className="input-filtrado">
          <InputComponent placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedasubcategoria(true)} selectedProduct={subcategoria?.nombre ?? ''} />
          {modalBusquedasubcategoria && <ModalFlotanteRecomendacionesSubcategoria onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { setSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
        </div>
        <div className="input-filtrado">
          <InputComponent placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={medida?.nombre ?? ''} />
          {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { setMedida(medida); handleModalClose(); }} />}
        </div>
      </div>
      <hr />
      <button className='button-form' type='button' onClick={editarArticuloVenta}>Editar articulo</button>

    </div >
  )
}


export default EditarArticuloVenta
