import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { SubcategoriaService } from '../../services/SubcategoriaService';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';

function AgregarSubcategoria() {

  const [nombre, setNombre] = useState('');

  async function agregarCategoria() {
    const subcategoria: Subcategoria = new Subcategoria();

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    subcategoria.denominacion = nombre;
    subcategoria.borrado = 'NO';

    toast.promise(SubcategoriaService.createSubcategoria(subcategoria), {
      loading: 'Creando Categoria...',
      success: (message) => {
        setNombre('');
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <h2>Cargar nueva subcategoria</h2>
      <Toaster />
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre de la subcategoria</span>
      </div>
      <button value="Agregar categoria" id="agregarCategoria" onClick={agregarCategoria}>Cargar</button>
    </div>
  )
}

export default AgregarSubcategoria
