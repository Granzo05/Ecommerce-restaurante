import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { IngredienteService } from '../../services/IngredienteService';

function AgregarIngrediente() {

  const [nombre, setNombre] = useState('');

  async function agregarIngrediente() {
    const ingrediente: Ingrediente = new Ingrediente();

    ingrediente.nombre = nombre;

    toast.promise(IngredienteService.createIngrediente(ingrediente), {
      loading: 'Creando Ingrediente...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <Toaster/>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" required placeholder="Nombre del ingrediente" onChange={(e) => { setNombre(e.target.value) }} />
      </label>
      <br />
      <button value="Agregar ingrediente" id="agregarIngrediente" onClick={agregarIngrediente}>Agregar ingrediente</button>
    </div>
  )
}

export default AgregarIngrediente
