import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { Toaster, toast } from 'sonner'
import { IngredienteService } from '../../services/IngredienteService';

interface EditarIngredienteProps {
  ingredienteOriginal: Ingrediente;
}

const EditarIngrediente: React.FC<EditarIngredienteProps> = ({ ingredienteOriginal }) => {

  const [nombre, setNombre] = useState(ingredienteOriginal.nombre);

  function editarIngrediente() {
    const ingrediente: Ingrediente = ingredienteOriginal;

    if (!nombre) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    ingrediente.nombre = nombre;
    toast.promise(IngredienteService.updateIngrediente(ingrediente), {
      loading: 'Creando Ingrediente...',
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
      <Toaster />
      <br />
      <input type="text" value={nombre} placeholder="Nombre del ingrediente" onChange={(e) => { setNombre(e.target.value) }} />
      <br />
      <button onClick={editarIngrediente}>Editar ingrediente</button>
    </div>
  )
}

export default EditarIngrediente
