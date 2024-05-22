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
      toast.info("Por favor, asigne el nombre");
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
      <h2>Editar ingrediente</h2>
      <Toaster />
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del ingrediente</span>
      </div>
      <button onClick={editarIngrediente}>Editar ingrediente</button>
    </div>
  )
}

export default EditarIngrediente
