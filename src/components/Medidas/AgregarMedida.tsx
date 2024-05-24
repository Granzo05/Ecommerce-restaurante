import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Medida } from '../../types/Ingredientes/Medida';
import { MedidaService } from '../../services/MedidaService';

function AgregarMedida() {

  const [nombre, setNombre] = useState('');

  async function agregarMedida() {
    const medida: Medida = new Medida();

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    medida.nombre = nombre;
    medida.borrado = 'NO';

    toast.promise(MedidaService.createMedida(medida), {
      loading: 'Creando Medida...',
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
      <h2>Cargar nuevo medida</h2>
      <Toaster />
      <div className="inputBox">
        <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del medida</span>
      </div>
      <button value="Agregar medida" id="agregarMedida" onClick={agregarMedida}>Cargar </button>
    </div>
  )
}

export default AgregarMedida
