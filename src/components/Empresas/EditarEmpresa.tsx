import { useState } from 'react';
import { Imagenes } from '../../types/Productos/Imagenes';
import { Toaster, toast } from 'sonner'
import { Empresa } from '../../types/Restaurante/Empresa';
import { EmpresaService } from '../../services/EmpresaService';

interface EditarMenuProps {
  empresaOriginal: Empresa;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ empresaOriginal }) => {
  const [imagenesMuestra, setImagenesMuestra] = useState<Imagenes[]>(empresaOriginal.imagenes);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<Imagenes[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>(empresaOriginal.imagenes);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [nombre, setNombre] = useState(empresaOriginal.nombre);
  const [cuit, setCuit] = useState(empresaOriginal.cuit);
  const [razonSocial, setRazonSocial] = useState(empresaOriginal.razonSocial);
  const [contraseña, setContraseña] = useState('');

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
    } else if (imagenes.length === 0 || imagenesMuestra.length === 0) {
      toast.error("Por favor, es necesaria una imagen");
      return;
    }

    let empresa: Empresa = empresaOriginal;

    empresa.nombre = nombre;

    empresa.cuit = cuit;

    empresa.razonSocial = razonSocial;

    if (contraseña.length > 2) empresa.contraseña = contraseña;

    empresa.borrado = 'NO';

    console.log(empresa);
    toast.promise(EmpresaService.updateEmpresa(empresa, imagenes, imagenesEliminadas), {
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
      <h2>&mdash; Editar empresa &mdash;</h2>
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
        <div className="inputBox">
          <input type="text" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
          <span>Contraseña</span>
        </div>
      </form>
      <hr />
      <button type="button" onClick={handleCargarNegocio}>Agregar empresa</button>

    </div>
  )
}


export default EditarMenu
