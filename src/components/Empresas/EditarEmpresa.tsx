import { useState } from 'react';
import { Imagenes } from '../../types/Productos/Imagenes';
import { Toaster, toast } from 'sonner'
import { Empresa } from '../../types/Restaurante/Empresa';
import { EmpresaService } from '../../services/EmpresaService';

interface EditarMenuProps {
  empresaOriginal: Empresa;
  onCloseModal: () => void;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ empresaOriginal, onCloseModal }) => {
  const [imagenesMuestra, setImagenesMuestra] = useState<Imagenes[]>(empresaOriginal.imagenes);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<Imagenes[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
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

  const [isLoading, setIsLoading] = useState(false);

  function handleCargarNegocio() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!cuit || cuit.length !== 13) {
      toast.error("Por favor, es necesaria el cuit");
      return;
    } else if (!razonSocial) {
      toast.error("Por favor, es necesaria la razón social");
      return;
    } else if (!contraseña || contraseña.length < 8) {
      toast.error("Por favor, es necesaria la contraseña");
      return;
    } else if (imagenes.length === 0 && imagenesMuestra.length === 0) {
      toast.error("Por favor, es necesaria una imagen");
      return;
    }
    setIsLoading(true);

    let empresa: Empresa = empresaOriginal;

    empresa.nombre = nombre;

    empresa.cuit = cuit;

    empresa.razonSocial = razonSocial;

    if (contraseña.length > 2) empresa.contraseña = contraseña;

    empresa.borrado = 'NO';

    toast.promise(EmpresaService.updateEmpresa(empresa, imagenes, imagenesEliminadas), {
      loading: 'Editando empresa...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
      },
      finally: () => {
        setIsLoading(false);
      }
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

  const formatearCuil = (value: string) => {
    // Eliminar todos los caracteres no numéricos
    const soloNumeros = value.replace(/\D/g, "");

    // Insertar los guiones en las posiciones correctas
    let cuilFormateado = "";
    if (soloNumeros.length > 2) {
      cuilFormateado += soloNumeros.slice(0, 2) + "-";
      if (soloNumeros.length > 10) {
        cuilFormateado += soloNumeros.slice(2, 10) + "-";
        cuilFormateado += soloNumeros.slice(10, 11);
      } else {
        cuilFormateado += soloNumeros.slice(2);
      }
    } else {
      cuilFormateado = soloNumeros;
    }

    return cuilFormateado;
  };
  const handleCuilChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    const cuilFormateado = formatearCuil(value);
    setCuit(cuilFormateado);
  };

  return (
    <div className="modal-info">
      <h2>&mdash; Editar empresa &mdash;</h2>
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
      <button onClick={añadirCampoImagen}>Añadir imagen</button>
      <hr />
      <form>
        <div className="inputBox">
          <input autoComplete='false' type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
          <span>Nombre de la empresa</span>

          <div className="error-message">El nombre no puede ser vacío.</div>
        </div>
        <div className="inputBox">
          <input type="text" required={true} value={razonSocial} onChange={(e) => { setRazonSocial(e.target.value) }} />
          <span>Razón social</span>

          <div className="error-message">La razón social no puede ser vacía.</div>
        </div>
        <div className="inputBox">
          <input type="text" pattern=".{13}" required={true} value={cuit} onChange={handleCuilChange} />
          <span>CUIT</span>

          <div className="error-message">El CUIT debe contener sus 11 dígitos.</div>
        </div>
        <div className="inputBox">
          <input type="password" required={true} pattern=".{8,}" onChange={(e) => { setContraseña(e.target.value) }} />
          <span>Contraseña</span>
          <div className="error-message">La contraseña debe tener mínimo 8 dígitos.</div>

        </div>
      </form>
      <hr />
      <div className="btns-pasos">
        <button className='btn-accion-completar' onClick={handleCargarNegocio} disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Editar empresa ✓'}
        </button>
      </div>


    </div>
  )
}


export default EditarMenu
