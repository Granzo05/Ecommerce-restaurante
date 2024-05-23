import { useState } from 'react';
import { Empresa } from '../../types/Restaurante/Empresa';
import { EmpresaService } from '../../services/EmpresaService';
import { Toaster, toast } from 'sonner'
import { clearInputs } from '../../utils/global_variables/functions';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';

function AgregarEmpresa() {
  // Atributos necesarios para Empresa
  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  const [imagenes, setImagenes] = useState<ImagenesProducto[]>([]);
  let [selectIndexImagenes, setSelectIndexImagenes] = useState<number>(0);

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    setImagenes([...imagenes, { index: imagenes.length, file: null } as ImagenesProducto]);
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
    }

    let empresa: Empresa = new Empresa();

    empresa.nombre = nombre;

    empresa.cuit = cuit;

    empresa.razonSocial = razonSocial;

    empresa.borrado = 'NO';

    toast.promise(EmpresaService.createEmpresa(empresa), {
      loading: 'Guardando empresa...',
      success: (message) => {
        clearInputs();
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  return (
    <div className='modal-info'>
      <h2>Agregar empresa</h2>
      <Toaster />
      <div>
        {imagenes.map((imagen, index) => (

          <div className='inputBox' key={index}>
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
      <form>
        <div className="inputBox">
          <input autoComplete='false' type="text" required={true} onChange={(e) => { setNombre(e.target.value) }} />
          <span>Nombre</span>
        </div>
        <div className="inputBox">
          <input type="text" required={true} onChange={(e) => { setRazonSocial(e.target.value) }} />
          <span>Razón social</span>
        </div>
        <div className="inputBox">
          <input type="text" required={true} onChange={(e) => { setCuit(e.target.value) }} />
          <span>Cuit</span>
        </div>
      </form>
      <hr />
      <button type="button" onClick={handleCargarNegocio}>Agregar empresa</button>
    </div>
  )
}

export default AgregarEmpresa
