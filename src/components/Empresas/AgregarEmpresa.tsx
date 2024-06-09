import { useState } from 'react';
import { Empresa } from '../../types/Restaurante/Empresa';
import { EmpresaService } from '../../services/EmpresaService';
import { Toaster, toast } from 'sonner'
import { Imagenes } from '../../types/Productos/Imagenes';

interface AgregarEmpresaProps {
  onCloseModal: () => void;
}

const AgregarEmpresa: React.FC<AgregarEmpresaProps> = ({ onCloseModal }) => {
  // Atributos necesarios para Empresa
  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  let [selectIndexImagenes, setSelectIndexImagenes] = useState<number>(0);

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

      if (selectIndexImagenes > 0) {
        setSelectIndexImagenes(prevIndex => prevIndex - 1);
      }
    } else {
      const nuevasImagenes = [...imagenes];
      nuevasImagenes.pop();
      setImagenes(nuevasImagenes);
      setSelectIndexImagenes(0);
    }
  };

  const handleCargarNegocio = async () => {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!cuit) {
      toast.error("Por favor, es necesaria el cuit");
      return;
    } else if (!razonSocial) {
      toast.error("Por favor, es necesaria la razón social");
      return;
    } else if (!contraseña) {
      toast.error("Por favor, es necesaria la contraseña");
      return;
    } else if (imagenes.length === 0) {
      toast.error("Por favor, es necesaria una imagen");
      return;
    }

    let empresa: Empresa = new Empresa();

    empresa.nombre = nombre;

    empresa.cuit = cuit;

    empresa.razonSocial = razonSocial;

    empresa.contraseña = contraseña;

    empresa.borrado = 'NO';

    toast.promise(EmpresaService.createEmpresa(empresa, imagenes), {
      loading: 'Creando empresa...',
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
              <input type="text" required={true} value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña</span>
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div>
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
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={handleCargarNegocio}>Agregar empresa ✓</button>

            </div>
          </>
        );
    }
  }

  return (
    <div className='modal-info'>
      <h2>&mdash; Agregar empresa &mdash;</h2>
      <Toaster />
      {renderStep()}
    </div>
  )
}

export default AgregarEmpresa
