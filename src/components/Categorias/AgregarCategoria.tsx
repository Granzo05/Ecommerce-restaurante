import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Categoria } from '../../types/Ingredientes/Categoria';
import { CategoriaService } from '../../services/CategoriaService';

function AgregarCategoria() {

  const [nombre, setNombre] = useState('');

  async function agregarCategoria() {
    const categoria: Categoria = new Categoria();

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    categoria.nombre = nombre;
    categoria.borrado = 'NO';

    toast.promise(CategoriaService.createCategoria(categoria), {
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
      <h2>Cargar nuevo categoria</h2>
      <Toaster />
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del categoria</span>
      </div>
      <button value="Agregar categoria" id="agregarCategoria" onClick={agregarCategoria}>Cargar </button>
    </div>
  )
}

export default AgregarCategoria
