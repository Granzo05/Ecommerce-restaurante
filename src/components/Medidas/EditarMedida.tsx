import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { Medida } from '../../types/Ingredientes/Medida';
import { Toaster, toast } from 'sonner'
import { MedidaService } from '../../services/MedidaService';

interface EditarMedidaProps {
  medidaOriginal: Medida;
}

const EditarMedida: React.FC<EditarMedidaProps> = ({ medidaOriginal }) => {

  const [nombre, setNombre] = useState(medidaOriginal.nombre);

  function editarMedida() {
    const medida: Medida = medidaOriginal;
    medida.borrado = 'NO';

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    medida.nombre = nombre;
    toast.promise(MedidaService.updateMedida(medida), {
      loading: 'Creando Medida...',
      success: (message) => {
        clearInputs();
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <h2>Editar medida</h2>
      <Toaster />
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del medida</span>
      </div>
      <button onClick={editarMedida}>Editar medida</button>
    </div>
  )
}

export default EditarMedida
