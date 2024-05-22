import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { IngredienteService } from '../../services/IngredienteService';

function AgregarIngrediente() {

  const [nombre, setNombre] = useState('');

  async function agregarIngrediente() {
    const ingrediente: Ingrediente = new Ingrediente();

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    ingrediente.nombre = nombre;
    ingrediente.borrado = 'NO';

    toast.promise(IngredienteService.createIngrediente(ingrediente), {
      loading: 'Creando Ingrediente...',
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
      <h2>Cargar nuevo ingrediente</h2>
      <Toaster />
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del ingrediente</span>
      </div>
      <button value="Agregar ingrediente" id="agregarIngrediente" onClick={agregarIngrediente}>Cargar </button>
    </div>
  )
}

export default AgregarIngrediente
