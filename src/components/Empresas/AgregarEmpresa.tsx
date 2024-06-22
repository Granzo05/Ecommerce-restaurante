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

  const validateAndNextStep = () => {
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
              <input type="password" required={true} pattern=".{8,}" value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña</span>
              <div className="error-message">La contraseña debe tener mínimo 8 dígitos.</div>

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
