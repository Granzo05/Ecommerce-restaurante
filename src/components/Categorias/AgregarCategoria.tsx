import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Categoria } from '../../types/Ingredientes/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import { Imagenes } from '../../types/Productos/Imagenes';

interface AgregarCategoriaProps {
  onCloseModal: () => void;
}

const AgregarCategoria: React.FC<AgregarCategoriaProps> = ({ onCloseModal }) => {
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

  const [nombre, setNombre] = useState('');

  async function agregarCategoria() {
    const categoria: Categoria = new Categoria();

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    categoria.nombre = nombre;
    categoria.borrado = 'NO';

    toast.promise(CategoriaService.createCategoria(categoria, imagenes), {
      loading: 'Creando Categoria...',
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
      <h2>&mdash; Cargar nueva categoria &mdash;</h2>
      <Toaster />
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
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del categoria</span>
      </div>
      <button value="Agregar categoria" id="agregarCategoria" onClick={agregarCategoria}>Cargar </button>
    </div>
  )
}

export default AgregarCategoria
