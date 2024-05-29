import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Categoria } from '../../types/Ingredientes/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import { Imagenes } from '../../types/Productos/Imagenes';

function AgregarCategoria() {
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
        setNombre('');
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <h2>Cargar nuevo categoria</h2>
      <Toaster />
      <div >
        {imagenes.map((imagen, index) => (
          <div key={index} className='inputBox'>
            <p className='cierre-ingrediente' onClick={quitarCampoImagen}>X</p>
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
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del categoria</span>
      </div>
      <button value="Agregar categoria" id="agregarCategoria" onClick={agregarCategoria}>Cargar </button>
    </div>
  )
}

export default AgregarCategoria
