import { useState } from 'react';
import { clearInputs } from '../../utils/global_variables/functions';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import { Toaster, toast } from 'sonner'
import { SubcategoriaService } from '../../services/SubcategoriaService';

interface EditarSubcategoriaProps {
  subcategoriaOriginal: Subcategoria;
}

const EditarSubcategoria: React.FC<EditarSubcategoriaProps> = ({ subcategoriaOriginal }) => {

  const [nombre, setNombre] = useState(subcategoriaOriginal.denominacion);

  function editarCategoria() {
    const subcategoria: Subcategoria = subcategoriaOriginal;

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    subcategoria.denominacion = nombre;
    toast.promise(SubcategoriaService.updateSubcategoria(subcategoria), {
      loading: 'Creando Subcategoria...',
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
      <h2>Editar categoria</h2>
      <Toaster />
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre de la subcategoria</span>
      </div>
      <button onClick={editarCategoria}>Editar categoria</button>
    </div>
  )
}

export default EditarSubcategoria
