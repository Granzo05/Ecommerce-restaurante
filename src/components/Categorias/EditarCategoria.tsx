import { useState } from 'react';
import { Categoria } from '../../types/Ingredientes/Categoria';
import { Toaster, toast } from 'sonner'
import { CategoriaService } from '../../services/CategoriaService';
import { Imagenes } from '../../types/Productos/Imagenes';

interface EditarCategoriaProps {
  categoriaOriginal: Categoria;
  onCloseModal: () => void;
}

const EditarCategoria: React.FC<EditarCategoriaProps> = ({ categoriaOriginal, onCloseModal }) => {

  const [imagenesMuestra, setImagenesMuestra] = useState<Imagenes[]>(categoriaOriginal.imagenes);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<Imagenes[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenesMuestra.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagenesMuestra.length - 1 : prevIndex - 1
    );
  };

  const [nombre, setNombre] = useState(categoriaOriginal.nombre);

  function editarCategoria() {
    const categoria: Categoria = categoriaOriginal;
    categoria.borrado = 'NO';

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    categoria.nombre = nombre;
    toast.promise(CategoriaService.updateCategoria(categoria, imagenes, imagenesEliminadas), {
      loading: 'Editando Categoria...',
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

  return (
    <div className="modal-info">
      <h2>Editar categoria</h2>
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
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del categoria</span>
      </div>
      <button onClick={editarCategoria}>Editar categoria</button>
    </div>
  )
}

export default EditarCategoria
