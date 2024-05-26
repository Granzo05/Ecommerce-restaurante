import { useState } from 'react';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import { Toaster, toast } from 'sonner'
import { SubcategoriaService } from '../../services/SubcategoriaService';

interface EditarSubcategoriaProps {
  subcategoriaOriginal: Subcategoria;
  onCloseModal: () => void;
}

const EditarSubcategoria: React.FC<EditarSubcategoriaProps> = ({ subcategoriaOriginal, onCloseModal }) => {

  const [nombre, setNombre] = useState(subcategoriaOriginal.nombre);

  function editarCategoria() {
    const subcategoria: Subcategoria = subcategoriaOriginal;

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    subcategoria.nombre = nombre;
    toast.promise(SubcategoriaService.updateSubcategoria(subcategoria), {
      loading: 'Editando Subcategoria...',
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
