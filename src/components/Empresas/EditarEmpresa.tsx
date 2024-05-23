import { useState } from 'react';
import { ImagenesProductoDTO } from '../../types/Productos/ImagenesProductoDTO';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';
import { Toaster, toast } from 'sonner'
import { Empresa } from '../../types/Restaurante/Empresa';
import { EmpresaService } from '../../services/EmpresaService';

interface EditarMenuProps {
  empresaOriginal: Empresa;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ empresaOriginal }) => {
  const [imagenesMuestra, setImagenesMuestra] = useState<ImagenesProductoDTO[]>(empresaOriginal.imagenesDTO);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<ImagenesProductoDTO[]>([]);
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>(empresaOriginal.imagenes);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    let imagenNueva = new ImagenesProducto();
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

  function handleCargarNegocio() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!cuit) {
      toast.error("Por favor, es necesaria el cuit");
      return;
    } else if (!razonSocial) {
      toast.error("Por favor, es necesaria la razón social");
      return;
    }


    let empresa: Empresa = new Empresa();

    empresa.nombre = nombre;

    empresa.cuit = cuit;

    empresa.razonSocial = razonSocial;

    empresa.borrado = 'NO';

    toast.promise(EmpresaService.createEmpresa(empresa), {
      loading: 'Editando empresa...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
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
      <Toaster />
      <h2>Editar menú</h2>
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
      <br />
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
      <br />
      <button onClick={añadirCampoImagen}>Añadir imagen</button>
      <form>
        <div className="inputBox">
          <input autoComplete='false' type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
          <span>Nombre</span>
        </div>
        <div className="inputBox">
          <input type="text" required={true} value={razonSocial} onChange={(e) => { setRazonSocial(e.target.value) }} />
          <span>Razón social</span>
        </div>
        <div className="inputBox">
          <input type="text" required={true} value={cuit} onChange={(e) => { setCuit(e.target.value) }} />
          <span>Cuit</span>
        </div>
      </form>
      <hr />
      <button type="button" onClick={handleCargarNegocio}>Agregar empresa</button>

    </div>
  )
}


export default EditarMenu
